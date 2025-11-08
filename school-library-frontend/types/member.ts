
export interface Member {
  id: number
  memberId: string
  name: string
  email: string
  username: string
  joinDate: string
}

export interface MemberFormData {
  name: string
  email: string
  username: string
  password?: string 
}