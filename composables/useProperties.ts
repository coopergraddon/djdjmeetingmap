import { ref, watch, readonly } from '#imports';

export interface Property {
  id: string;
  address: string;
  apn: string;
  phase: string;
  type: string;
  city: string;
  permit: string;
  sqft: string;
  client: string;
  startDate: string;
  deadline: string;
  notes: string;
  permitSubmitted: string;
  permitIssued: string;
  daysToComplete: string;
  estimatedDaysToComplete: string;
  financialInstitution: string;
  category: string;
  completed?: string;
  project?: string;
  style?: string;
  pm?: string;
  lot?: string;
  draw?: string;
  certOfOcc?: string;
  daysSinceStart?: string;
  daysSinceSubmital?: string;
  windowsOrdered?: string;
  daysFromStartToFinish?: string;
}

export const useProperties = () => {
  // Dynamic property data from CSV
  const allProperties = ref<Property[]>([]);
  const filteredProperties = ref<Property[]>([]);
  const currentView = ref<'overview' | 'list' | 'detail'>('overview');
  const selectedProperty = ref<Property | null>(null);
  const searchTerm = ref('');
  const selectedPhase = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastUpdated = ref<string | null>(null);
  const searchField = ref('all');
  const completionFrom = ref('');
  const completionTo = ref('');

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      'Sheetrock': 'phase-sheetrock',
      'Flatwork': 'phase-flatwork',
      'Roof': 'phase-roof',
      'Final': 'phase-final',
      'Design': 'phase-design',
      'Sold': 'phase-sold',
      'Listed': 'phase-listed',
      'Pending': 'phase-pending',
      'Delete': 'phase-delete',
      'Hold': 'phase-unknown',
      'Upcoming': 'phase-design',
      'Unknown': 'phase-unknown'
    };
    return colors[phase] || 'bg-gray-500 text-white';
  };

  const getPhaseIcon = (phase: string) => {
    const icons: Record<string, string> = {
      'Sheetrock': 'fas fa-paint-roller',
      'Flatwork': 'fas fa-hammer',
      'Roof': 'fas fa-home',
      'Final': 'fas fa-check-circle',
      'Design': 'fas fa-drafting-compass',
      'Sold': 'fas fa-dollar-sign',
      'Listed': 'fas fa-tag',
      'Pending': 'fas fa-clock',
      'Delete': 'fas fa-trash',
      'Hold': 'fas fa-pause',
      'Upcoming': 'fas fa-calendar-plus'
    };
    return icons[phase] || 'fas fa-info';
  };

  // Helper to deduplicate properties by APN or address
  function deduplicateProperties(properties: Property[]) {
    const seen = new Set();
    return properties.filter(p => {
      const key = (p.apn || '').toLowerCase() || (p.address || '').toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Helper to parse deadline in various formats, with debug logging
  function parseDeadline(raw: string | undefined, property?: any) {
    if (!raw) return null;
    const s = raw.trim();
    // Try YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s);
    // Try M/D/YY or M/D/YYYY or MM/DD/YY or MM/DD/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(s)) {
      const [m, d, y] = s.split('/');
      let year = y.length === 2
        ? (parseInt(y, 10) > 50 ? 1900 + parseInt(y, 10) : 2000 + parseInt(y, 10))
        : parseInt(y, 10);
      return new Date(year, parseInt(m, 10) - 1, parseInt(d, 10));
    }
    // Try M-D-YY or M-D-YYYY or MM-DD-YY or MM-DD-YYYY
    if (/^\d{1,2}-\d{1,2}-\d{2,4}$/.test(s)) {
      const [m, d, y] = s.split('-');
      let year = y.length === 2
        ? (parseInt(y, 10) > 50 ? 1900 + parseInt(y, 10) : 2000 + parseInt(y, 10))
        : parseInt(y, 10);
      return new Date(year, parseInt(m, 10) - 1, parseInt(d, 10));
    }
    // Log unparseable dates for debugging
    if (property) {
      // eslint-disable-next-line no-console
      console.warn('Unparseable deadline:', s, 'for property:', property.address || property.apn);
    }
    return null;
  }

  const fetchProperties = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await $fetch('/api/properties');
      
      if (response.success) {
        // Deduplicate on load
        allProperties.value = deduplicateProperties(response.properties);
        if ('lastUpdated' in response && response.lastUpdated) {
          lastUpdated.value = response.lastUpdated;
        }
        // Initialize filtered properties
        if (currentView.value === 'list') {
          filteredProperties.value = [...allProperties.value];
        }
      } else {
        error.value = ('error' in response && response.error) ? response.error : 'Failed to fetch properties';
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      error.value = 'Failed to load property data';
    } finally {
      isLoading.value = false;
    }
  };

  const filterProperties = () => {
    const search = searchTerm.value.trim().toLowerCase();
    const phase = selectedPhase.value;
    let base = deduplicateProperties(allProperties.value);
    filteredProperties.value = base.filter(property => {
      let matchesSearch = true;
      if (search) {
        switch (searchField.value) {
          case 'address':
            matchesSearch = !!property.address && property.address.toLowerCase().includes(search);
            break;
          case 'city':
            matchesSearch = !!property.city && property.city.toLowerCase().includes(search);
            break;
          case 'apn':
            matchesSearch = !!property.apn && property.apn.toLowerCase().includes(search);
            break;
          case 'client':
            matchesSearch = !!property.client && property.client.toLowerCase().includes(search);
            break;
          default:
            matchesSearch =
              (!!property.address && property.address.toLowerCase().includes(search)) ||
              (!!property.apn && property.apn.toLowerCase().includes(search)) ||
              (!!property.city && property.city.toLowerCase().includes(search)) ||
              (!!property.client && property.client.toLowerCase().includes(search));
        }
      }
      const matchesPhase = !phase || property.phase === phase;
      // Filter by deadline date range
      let matchesDate = true;
      if (completionFrom.value || completionTo.value) {
        const deadlineDate = parseDeadline(property.deadline, property);
        const fromTime = completionFrom.value ? new Date(completionFrom.value).getTime() : null;
        const toTime = completionTo.value ? new Date(completionTo.value).getTime() : null;
        // Debug log
        console.log({
          address: property.address,
          raw: property.deadline,
          parsed: deadlineDate,
          from: completionFrom.value,
          to: completionTo.value,
          fromTime,
          toTime,
          deadlineTime: deadlineDate ? deadlineDate.getTime() : null
        });
        if (!deadlineDate || isNaN(deadlineDate.getTime())) return false;
        if (fromTime !== null && deadlineDate.getTime() < fromTime) matchesDate = false;
        if (toTime !== null && deadlineDate.getTime() > toTime) matchesDate = false;
      }
      return matchesSearch && matchesPhase && matchesDate;
    });
  };

  const showAllProperties = () => {
    currentView.value = 'list';
    searchTerm.value = '';
    selectedPhase.value = '';
    filteredProperties.value = [...allProperties.value];
  };

  const showPortfolioOverview = () => {
    currentView.value = 'overview';
    selectedPhase.value = '';
    searchTerm.value = '';
  };

  const showPropertiesByCategory = (category: string, phases?: string[]) => {
    currentView.value = 'list';
    searchTerm.value = '';
    selectedPhase.value = '';
    if (phases && phases.length > 0) {
      filteredProperties.value = allProperties.value.filter(p => phases.includes(p.phase));
      return;
    }
    if (category === 'Construction') {
      filteredProperties.value = allProperties.value.filter(p => 
        ['Sheetrock', 'Flatwork', 'Roof', 'Final'].includes(p.phase)
      );
    } else if (category === 'Completed') {
      filteredProperties.value = allProperties.value.filter(p => 
        ['Sold', 'Listed', 'Pending'].includes(p.phase)
      );
    } else if (category === 'Upcoming') {
      filteredProperties.value = allProperties.value.filter(p => 
        ['Design', 'Hold', 'Upcoming'].includes(p.phase)
      );
    }
  };

  const showPropertyDetail = (property: Property) => {
    selectedProperty.value = property;
    currentView.value = 'detail';
  };

  const goBack = () => {
    if (currentView.value === 'detail') {
      currentView.value = 'list';
      selectedProperty.value = null;
    } else if (currentView.value === 'list') {
      currentView.value = 'overview';
    }
  };

  const handleViewArcGIS = (apn: string) => {
    const url = `https://experience.arcgis.com/experience/c69f053c68e84a0ab98bc80b00836949/#data_s=where:dataSource_5-c618cc10482c44689186cffcf8f4521a:geo_id='${apn}'&zoom_to_selection=true`;
    window.open(url, '_blank');
  };

  const handleViewCounty = (apn: string) => {
    const url = `https://whatcom.maps.arcgis.com/apps/webappviewer/index.html?id=f2f8eaa500b04f54948c680bb280129f&find=${apn}`;
    window.open(url, '_blank');
  };

  // Watch for changes in search and filter
  watch([searchTerm, selectedPhase, searchField, completionFrom, completionTo], filterProperties);

  // Auto-refresh data every 5 minutes
  let refreshInterval: NodeJS.Timeout;
  
  const startAutoRefresh = () => {
    refreshInterval = setInterval(fetchProperties, 5 * 60 * 1000); // 5 minutes
  };

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  };

  return {
    allProperties: readonly(allProperties),
    filteredProperties: readonly(filteredProperties),
    currentView: readonly(currentView),
    selectedProperty: readonly(selectedProperty),
    searchTerm,
    selectedPhase,
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastUpdated: readonly(lastUpdated),
    getPhaseColor,
    getPhaseIcon,
    fetchProperties,
    showAllProperties,
    showPortfolioOverview,
    showPropertiesByCategory,
    showPropertyDetail,
    goBack,
    handleViewArcGIS,
    handleViewCounty,
    startAutoRefresh,
    stopAutoRefresh,
    searchField,
    completionFrom,
    completionTo,
    filterProperties
  };
}; 