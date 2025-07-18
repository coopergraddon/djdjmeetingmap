import { defineStore } from 'pinia'
import Papa from 'papaparse'

export interface Property {
  id: string
  address: string
  apn: string
  phase: string
  type: string
  city: string
  permit?: string
  sqft?: string
  client?: string
  startDate?: string
  deadline?: string
  completed?: string
  notes?: string
  permitSubmitted?: string
  permitIssued?: string
  daysToComplete?: string
  estimatedDaysToComplete?: string
  financialInstitution?: string
  category: 'Construction' | 'Completed' | 'Upcoming'
}

export const usePropertiesStore = defineStore('properties', {
  state: () => ({
    properties: [] as Property[],
    loading: false,
    error: null as string | null,
    searchTerm: '',
    selectedPhase: '',
    currentView: 'overview' as 'overview' | 'list' | 'detail',
    selectedProperty: null as Property | null
  }),

  getters: {
    filteredProperties: (state) => {
      return state.properties.filter(property => {
        const matchesSearch = !state.searchTerm || 
          property.address.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          property.apn.includes(state.searchTerm) ||
          property.city.toLowerCase().includes(state.searchTerm.toLowerCase())
        
        const matchesPhase = !state.selectedPhase || property.phase === state.selectedPhase
        
        return matchesSearch && matchesPhase
      })
    },

    constructionProperties: (state) => {
      return state.properties.filter(p => 
        ['Sheetrock', 'Flatwork', 'Roof', 'Final'].includes(p.phase)
      )
    },

    completedProperties: (state) => {
      return state.properties.filter(p => 
        ['Sold', 'Listed', 'Pending'].includes(p.phase)
      )
    },

    upcomingProperties: (state) => {
      return state.properties.filter(p => 
        ['Design', 'Delete', 'Hold', 'Unknown'].includes(p.phase)
      )
    },

    phaseDistribution: (state) => {
      const phaseCounts: Record<string, number> = {}
      state.properties.forEach(property => {
        phaseCounts[property.phase] = (phaseCounts[property.phase] || 0) + 1
      })
      return phaseCounts
    },

    totalProperties: (state) => state.properties.length,
    
    stats: (state) => ({
      total: state.properties.length,
      construction: state.properties.filter(p => 
        ['Sheetrock', 'Flatwork', 'Roof', 'Final'].includes(p.phase)
      ).length,
      upcoming: state.properties.filter(p => 
        ['Design', 'Delete', 'Hold', 'Unknown'].includes(p.phase)
      ).length,
      completed: state.properties.filter(p => 
        ['Sold', 'Listed', 'Pending'].includes(p.phase)
      ).length
    })
  },

  actions: {
    async loadPropertiesFromCSV(csvFiles: File[]) {
      this.loading = true
      this.error = null
      
      try {
        const allProperties: Property[] = []
        
        for (const file of csvFiles) {
          const properties = await this.parseCSVFile(file)
          allProperties.push(...properties)
        }
        
        this.properties = allProperties
      } catch (error) {
        this.error = `Failed to load CSV files: ${error}`
        console.error('Error loading CSV files:', error)
      } finally {
        this.loading = false
      }
    },

    async parseCSVFile(file: File): Promise<Property[]> {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const properties = results.data.map((row: any, index: number) => {
                // Clean up headers by removing whitespace
                const cleanRow: any = {}
                Object.keys(row).forEach(key => {
                  const cleanKey = key.trim()
                  cleanRow[cleanKey] = row[key]
                })

                // Determine category based on phase or file context
                let category: 'Construction' | 'Completed' | 'Upcoming' = 'Upcoming'
                const phase = cleanRow.phase || cleanRow.Phase || ''
                
                if (['Sheetrock', 'Flatwork', 'Roof', 'Final'].includes(phase)) {
                  category = 'Construction'
                } else if (['Sold', 'Listed', 'Pending'].includes(phase)) {
                  category = 'Completed'
                } else if (['Design', 'Delete', 'Hold'].includes(phase)) {
                  category = 'Upcoming'
                }

                return {
                  id: `property-${cleanRow.apn || cleanRow.APN || index}`,
                  address: cleanRow.address || cleanRow.Address || '',
                  apn: cleanRow.apn || cleanRow.APN || '',
                  phase: phase,
                  type: cleanRow.type || cleanRow.Type || 'Single Family',
                  city: cleanRow.city || cleanRow.City || '',
                  permit: cleanRow.permit || cleanRow.Permit || '',
                  sqft: cleanRow.sqft || cleanRow.SQFT || cleanRow['Square Feet'] || '',
                  client: cleanRow.client || cleanRow.Client || '',
                  startDate: cleanRow.startDate || cleanRow['Start Date'] || '',
                  deadline: cleanRow.deadline || cleanRow.Deadline || '',
                  completed: cleanRow.completed || cleanRow.Completed || '',
                  notes: cleanRow.notes || cleanRow.Notes || '',
                  permitSubmitted: cleanRow.permitSubmitted || cleanRow['Permit Submitted'] || '',
                  permitIssued: cleanRow.permitIssued || cleanRow['Permit Issued'] || '',
                  daysToComplete: cleanRow.daysToComplete || cleanRow['Days to Complete'] || '',
                  estimatedDaysToComplete: cleanRow.estimatedDaysToComplete || cleanRow['Estimated Days'] || '',
                  financialInstitution: cleanRow.financialInstitution || cleanRow['Financial Institution'] || '',
                  category
                } as Property
              })
              
              resolve(properties.filter(p => p.address && p.apn)) // Filter out invalid entries
            } catch (error) {
              reject(error)
            }
          },
          error: (error) => {
            reject(error)
          }
        })
      })
    },

    setSearchTerm(term: string) {
      this.searchTerm = term
    },

    setSelectedPhase(phase: string) {
      this.selectedPhase = phase
    },

    setCurrentView(view: 'overview' | 'list' | 'detail') {
      this.currentView = view
    },

    setSelectedProperty(property: Property | null) {
      this.selectedProperty = property
    },

    getPropertyById(id: string): Property | undefined {
      return this.properties.find(p => p.id === id)
    },

    // Add sample data for demonstration
    loadSampleData() {
      this.properties = [
        {
          id: "property-3803204881530000",
          address: "2615 Woburn St",
          apn: "3803204881530000",
          phase: "Sheetrock",
          type: "Single Family",
          city: "Bellingham",
          permit: "BLD2024-0349",
          sqft: "2,438",
          client: "GM/ DJ & DJ",
          startDate: "4/3/2025",
          deadline: "8/18/2025",
          notes: "Primary residence construction",
          permitSubmitted: "3/8/2024",
          permitIssued: "10/25/2024",
          daysToComplete: "137",
          estimatedDaysToComplete: "137",
          financialInstitution: "N/A",
          category: "Construction"
        },
        {
          id: "property-4101324351700000",
          address: "2903 Hazelwood Dr",
          apn: "4101324351700000",
          phase: "Sold",
          type: "Ridge II- SFR",
          city: "Blaine",
          permit: "23253",
          sqft: "2108",
          client: "DJDJ/BB",
          startDate: "10/24/2024",
          completed: "1/30/2025",
          notes: "Successfully completed and sold",
          daysToComplete: "152",
          estimatedDaysToComplete: "150",
          financialInstitution: "WECU",
          category: "Completed"
        },
        {
          id: "property-4101314601950000",
          address: "Oceanside",
          apn: "4101314601950000",
          phase: "Design",
          type: "Residential",
          city: "Blaine",
          client: "Multiple",
          notes: "Kharis never got comments - Very close to resolving",
          category: "Upcoming"
        }
      ]
    }
  }
})