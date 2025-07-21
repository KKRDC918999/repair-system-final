export interface RepairRequest {
  id: string
  title: string
  description: string
  location: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  category: string
  requester: string
  phone: string
  createdAt: Date
  updatedAt: Date
  department: string
  assignedTo?: string
}

// Local Storage Database Operations
export class RepairDatabase {
  private static STORAGE_KEY = 'repair_requests'
  private static BACKUP_KEY = 'repair_requests_backup'

  // Get all repair requests
  static getAllRequests(): RepairRequest[] {
    if (typeof window === 'undefined') return []
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) return []
      
      const requests = JSON.parse(data)
      return requests.map((request: any) => ({
        ...request,
        createdAt: new Date(request.createdAt),
        updatedAt: new Date(request.updatedAt)
      }))
    } catch (error) {
      console.error('Error loading repair requests:', error)
      return []
    }
  }

  // Add new repair request
  static addRequest(request: Omit<RepairRequest, 'id' | 'createdAt' | 'updatedAt'>): RepairRequest {
    const newRequest: RepairRequest = {
      ...request,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      department: request.department,
      assignedTo: request.assignedTo || '',
    }
    
    const requests = this.getAllRequests()
    requests.push(newRequest)
    this.saveRequests(requests)
    
    return newRequest
  }

  // Update repair request
  static updateRequest(id: string, updates: Partial<RepairRequest>): RepairRequest | null {
    const requests = this.getAllRequests()
    const index = requests.findIndex(r => r.id === id)
    
    if (index === -1) return null
    
    requests[index] = {
      ...requests[index],
      ...updates,
      updatedAt: new Date()
    }
    
    this.saveRequests(requests)
    return requests[index]
  }

  // Delete repair request
  static deleteRequest(id: string): boolean {
    const requests = this.getAllRequests()
    const filteredRequests = requests.filter(r => r.id !== id)
    
    if (filteredRequests.length === requests.length) {
      return false // No request was deleted
    }
    
    this.saveRequests(filteredRequests)
    return true
  }

  // Get request by ID
  static getRequestById(id: string): RepairRequest | null {
    const requests = this.getAllRequests()
    return requests.find(r => r.id === id) || null
  }

  // Search requests
  static searchRequests(query: string): RepairRequest[] {
    const requests = this.getAllRequests()
    const lowerQuery = query.toLowerCase()
    
    return requests.filter(request => 
      request.title.toLowerCase().includes(lowerQuery) ||
      request.description.toLowerCase().includes(lowerQuery) ||
      request.location.toLowerCase().includes(lowerQuery) ||
      request.requester.toLowerCase().includes(lowerQuery) ||
      request.category.toLowerCase().includes(lowerQuery)
    )
  }

  // Filter requests by status
  static filterByStatus(status: RepairRequest['status']): RepairRequest[] {
    const requests = this.getAllRequests()
    return requests.filter(r => r.status === status)
  }

  // Filter requests by priority
  static filterByPriority(priority: RepairRequest['priority']): RepairRequest[] {
    const requests = this.getAllRequests()
    return requests.filter(r => r.priority === priority)
  }

  // Filter requests by category
  static filterByCategory(category: string): RepairRequest[] {
    const requests = this.getAllRequests()
    return requests.filter(r => r.category === category)
  }

  // Get statistics
  static getStatistics() {
    const requests = this.getAllRequests()
    
    const total = requests.length
    const pending = requests.filter(r => r.status === 'pending').length
    const inProgress = requests.filter(r => r.status === 'in-progress').length
    const completed = requests.filter(r => r.status === 'completed').length
    const cancelled = requests.filter(r => r.status === 'cancelled').length
    
    const highPriority = requests.filter(r => r.priority === 'high').length
    const mediumPriority = requests.filter(r => r.priority === 'medium').length
    const lowPriority = requests.filter(r => r.priority === 'low').length
    
    // Category statistics
    const categoryStats = requests.reduce((acc, request) => {
      acc[request.category] = (acc[request.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Average response time
    const completedRequests = requests.filter(r => r.status === 'completed')
    const avgResponseTime = completedRequests.length > 0 
      ? completedRequests.reduce((sum, r) => {
          const responseTime = r.updatedAt.getTime() - r.createdAt.getTime()
          return sum + responseTime
        }, 0) / completedRequests.length / (1000 * 60 * 60) // hours
      : 0
    
    return {
      total,
      byStatus: { pending, inProgress, completed, cancelled },
      byPriority: { high: highPriority, medium: mediumPriority, low: lowPriority },
      byCategory: categoryStats,
      averageResponseTime: Math.round(avgResponseTime)
    }
  }

  // Get recent requests
  static getRecentRequests(limit: number = 10): RepairRequest[] {
    const requests = this.getAllRequests()
    return requests
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  // Get urgent requests (high priority + pending)
  static getUrgentRequests(): RepairRequest[] {
    const requests = this.getAllRequests()
    return requests.filter(r => r.priority === 'high' && r.status === 'pending')
  }

  // Backup data
  static backupData(): boolean {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (data) {
        localStorage.setItem(this.BACKUP_KEY, data)
        return true
      }
      return false
    } catch (error) {
      console.error('Error backing up data:', error)
      return false
    }
  }

  // Restore data from backup
  static restoreFromBackup(): boolean {
    try {
      const backupData = localStorage.getItem(this.BACKUP_KEY)
      if (backupData) {
        localStorage.setItem(this.STORAGE_KEY, backupData)
        return true
      }
      return false
    } catch (error) {
      console.error('Error restoring from backup:', error)
      return false
    }
  }

  // Export data as JSON
  static exportData(): string {
    const requests = this.getAllRequests()
    return JSON.stringify(requests, null, 2)
  }

  // Import data from JSON
  static importData(jsonData: string): boolean {
    try {
      const requests = JSON.parse(jsonData)
      if (Array.isArray(requests)) {
        this.saveRequests(requests)
        return true
      }
      return false
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  // Clear all data
  static clearAllData(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Error clearing data:', error)
      return false
    }
  }

  // Private helper methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private static saveRequests(requests: RepairRequest[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(requests))
    } catch (error) {
      console.error('Error saving repair requests:', error)
    }
  }

  // Initialize with sample data if empty
  static initializeWithSampleData(): void {
    const requests = this.getAllRequests()
    if (requests.length === 0) {
      const sampleData: Omit<RepairRequest, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          title: 'แอร์คอนดิชันไม่เย็น',
          description: 'แอร์คอนดิชันในห้องประชุมไม่เย็น ต้องตรวจสอบและซ่อมแซม',
          location: 'ห้องประชุมใหญ่ ชั้น 2',
          priority: 'high',
          status: 'pending',
          category: 'ระบบปรับอากาศ',
          requester: 'คุณสมชาย ใจดี',
          phone: '081-234-5678',
          department: 'ฝ่ายบริหาร',
          assignedTo: 'พนักงาน A'
        },
        {
          title: 'ไฟในห้องน้ำเสีย',
          description: 'ไฟในห้องน้ำชายไม่ติด ต้องเปลี่ยนหลอดไฟ',
          location: 'ห้องน้ำชาย ชั้น 1',
          priority: 'medium',
          status: 'in-progress',
          category: 'ระบบไฟฟ้า',
          requester: 'คุณสมหญิง รักดี',
          phone: '082-345-6789',
          department: 'ฝ่ายบริหาร',
          assignedTo: 'พนักงาน B'
        },
        {
          title: 'ประตูเปิดปิดยาก',
          description: 'ประตูห้องทำงานเปิดปิดยาก ต้องปรับแต่งบานพับ',
          location: 'ห้องทำงาน หัวหน้าฝ่าย',
          priority: 'low',
          status: 'completed',
          category: 'งานไม้',
          requester: 'คุณสมศักดิ์ มั่นคง',
          phone: '083-456-7890',
          department: 'ฝ่ายบริหาร',
          assignedTo: 'พนักงาน A'
        },
        {
          title: 'เครื่องถ่ายเอกสารเสีย',
          description: 'เครื่องถ่ายเอกสารในห้องสำนักงานพิมพ์ไม่ชัด ต้องเปลี่ยนหมึก',
          location: 'ห้องสำนักงาน ชั้น 1',
          priority: 'medium',
          status: 'pending',
          category: 'อุปกรณ์สำนักงาน',
          requester: 'คุณสมปอง ใจเย็น',
          phone: '084-567-8901',
          department: 'ฝ่ายบริหาร',
          assignedTo: 'พนักงาน B'
        },
        {
          title: 'น้ำรั่วจากท่อ',
          description: 'น้ำรั่วจากท่อในห้องครัว ต้องซ่อมแซมทันที',
          location: 'ห้องครัว ชั้น 1',
          priority: 'high',
          status: 'in-progress',
          category: 'ระบบน้ำ',
          requester: 'คุณสมศรี รักสะอาด',
          phone: '085-678-9012',
          department: 'ฝ่ายบริหาร',
          assignedTo: 'พนักงาน A'
        }
      ]
      
      sampleData.forEach(data => this.addRequest(data))
    }
  }
} 