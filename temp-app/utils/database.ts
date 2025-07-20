import { RepairRequest } from './aiHelper'

const STORAGE_KEY = 'repair_requests'

// Database Operations
export class RepairDatabase {
  // Get all requests
  static getAllRequests(): RepairRequest[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const requests = JSON.parse(stored)
        return requests.map((req: any) => ({
          ...req,
          createdAt: new Date(req.createdAt),
          updatedAt: new Date(req.updatedAt)
        }))
      }
    } catch (error) {
      console.error('Error loading requests:', error)
    }
    
    return []
  }

  // Save all requests
  static saveAllRequests(requests: RepairRequest[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
    } catch (error) {
      console.error('Error saving requests:', error)
    }
  }

  // Add new request
  static addRequest(request: Omit<RepairRequest, 'id' | 'createdAt' | 'updatedAt'>): RepairRequest {
    const requests = this.getAllRequests()
    const newRequest: RepairRequest = {
      ...request,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    requests.push(newRequest)
    this.saveAllRequests(requests)
    return newRequest
  }

  // Update request
  static updateRequest(id: string, updates: Partial<RepairRequest>): RepairRequest | null {
    const requests = this.getAllRequests()
    const index = requests.findIndex(req => req.id === id)
    
    if (index === -1) return null
    
    const updatedRequest = {
      ...requests[index],
      ...updates,
      updatedAt: new Date()
    }
    
    requests[index] = updatedRequest
    this.saveAllRequests(requests)
    return updatedRequest
  }

  // Delete request
  static deleteRequest(id: string): boolean {
    const requests = this.getAllRequests()
    const filteredRequests = requests.filter(req => req.id !== id)
    
    if (filteredRequests.length === requests.length) {
      return false // No request was deleted
    }
    
    this.saveAllRequests(filteredRequests)
    return true
  }

  // Get request by ID
  static getRequestById(id: string): RepairRequest | null {
    const requests = this.getAllRequests()
    return requests.find(req => req.id === id) || null
  }

  // Get requests by status
  static getRequestsByStatus(status: RepairRequest['status']): RepairRequest[] {
    const requests = this.getAllRequests()
    return requests.filter(req => req.status === status)
  }

  // Get requests by priority
  static getRequestsByPriority(priority: RepairRequest['priority']): RepairRequest[] {
    const requests = this.getAllRequests()
    return requests.filter(req => req.priority === priority)
  }

  // Search requests
  static searchRequests(query: string): RepairRequest[] {
    const requests = this.getAllRequests()
    const lowerQuery = query.toLowerCase()
    
    return requests.filter(req => 
      req.title.toLowerCase().includes(lowerQuery) ||
      req.description.toLowerCase().includes(lowerQuery) ||
      req.location.toLowerCase().includes(lowerQuery) ||
      req.requester.toLowerCase().includes(lowerQuery) ||
      req.category.toLowerCase().includes(lowerQuery)
    )
  }

  // Get statistics
  static getStatistics() {
    const requests = this.getAllRequests()
    
    return {
      total: requests.length,
      pending: requests.filter(req => req.status === 'pending').length,
      inProgress: requests.filter(req => req.status === 'in-progress').length,
      completed: requests.filter(req => req.status === 'completed').length,
      cancelled: requests.filter(req => req.status === 'cancelled').length,
      highPriority: requests.filter(req => req.priority === 'high').length,
      mediumPriority: requests.filter(req => req.priority === 'medium').length,
      lowPriority: requests.filter(req => req.priority === 'low').length,
      criticalIssues: requests.filter(req => req.priority === 'high' && req.status === 'pending').length
    }
  }

  // Export data
  static exportData(): string {
    const requests = this.getAllRequests()
    return JSON.stringify(requests, null, 2)
  }

  // Import data
  static importData(data: string): boolean {
    try {
      const requests = JSON.parse(data)
      if (Array.isArray(requests)) {
        this.saveAllRequests(requests)
        return true
      }
    } catch (error) {
      console.error('Error importing data:', error)
    }
    return false
  }

  // Clear all data
  static clearAllData(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  }

  // Generate unique ID
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Backup data
  static backupData(): void {
    const data = this.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `repair_requests_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Restore from backup
  static async restoreFromBackup(file: File): Promise<boolean> {
    try {
      const text = await file.text()
      return this.importData(text)
    } catch (error) {
      console.error('Error restoring backup:', error)
      return false
    }
  }
}

// Initialize with sample data if empty
export const initializeDatabase = () => {
  const requests = RepairDatabase.getAllRequests()
  
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
        phone: '081-234-5678'
      },
      {
        title: 'ไฟในห้องน้ำเสีย',
        description: 'ไฟในห้องน้ำชายไม่ติด ต้องเปลี่ยนหลอดไฟ',
        location: 'ห้องน้ำชาย ชั้น 1',
        priority: 'medium',
        status: 'in-progress',
        category: 'ระบบไฟฟ้า',
        requester: 'คุณสมหญิง รักดี',
        phone: '082-345-6789'
      },
      {
        title: 'ประตูเปิดปิดยาก',
        description: 'ประตูห้องทำงานเปิดปิดยาก ต้องปรับแต่งบานพับ',
        location: 'ห้องทำงาน หัวหน้าฝ่าย',
        priority: 'low',
        status: 'completed',
        category: 'งานไม้',
        requester: 'คุณสมศักดิ์ มั่นคง',
        phone: '083-456-7890'
      },
      {
        title: 'เครื่องถ่ายเอกสารเสีย',
        description: 'เครื่องถ่ายเอกสารในห้องสำนักงานพิมพ์ไม่ชัด ต้องเปลี่ยนหมึก',
        location: 'ห้องสำนักงาน ชั้น 1',
        priority: 'medium',
        status: 'pending',
        category: 'อุปกรณ์สำนักงาน',
        requester: 'คุณสมปอง ใจเย็น',
        phone: '084-567-8901'
      },
      {
        title: 'น้ำรั่วจากท่อ',
        description: 'น้ำรั่วจากท่อในห้องครัว ต้องซ่อมแซมทันที',
        location: 'ห้องครัว ชั้น 1',
        priority: 'high',
        status: 'in-progress',
        category: 'ระบบน้ำ',
        requester: 'คุณสมศรี รักสะอาด',
        phone: '085-678-9012'
      }
    ]

    sampleData.forEach(data => {
      RepairDatabase.addRequest(data)
    })
  }
} 