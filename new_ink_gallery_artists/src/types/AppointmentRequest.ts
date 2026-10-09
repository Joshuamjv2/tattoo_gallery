export type Customer = {
    last_name: string
    first_name: string
    email: string
    phone: string
    contact_method: string
}

export type CreateAppointmentRequest = {
    customer_info: Customer
    length: number
    service?: number,
    idea?: string
    artist?: string
    design?: string
    images?: string[]
    first_date: Date
    second_date: Date
    third_date: Date
    notes?: string
    placement?: string
}
