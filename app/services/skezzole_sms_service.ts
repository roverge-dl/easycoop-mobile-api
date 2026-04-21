import env from '#start/env'
import axios from 'axios'
import { Exception } from '@adonisjs/core/exceptions'

export default class SkezzoleSmsService {
  private static baseUrl = 'https://skezzole.com.ng/api'
  private static apiKey = env.get('SKEZZOLE_API_KEY')

  /**
   * Get the default Axios headers including the authentication key
   */
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Api-Key': this.apiKey,
    }
  }

  /**
   * 1. Send SMS Message
   * @param to - Comma-separated list of recipient phone numbers (e.g., '2348012345678')
   * @param content - The message content (Max 1000 characters)
   * @param from - Optional custom Sender ID (Max 11 characters)
   */
  public static async sendSms(to: string, content: string, from?: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/sms/send`,
        { to, content, from },
        { headers: this.getHeaders() }
      )

      return response.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Exception(
          `SMS Failed: Insufficient Units. Available: ${error.response.data.available_units}`,
          { status: 403 }
        )
      }

      console.error('Skezzole Send SMS Error:', error.response?.data || error.message)
      throw new Exception('Failed to send SMS message via provider.', { status: 500 })
    }
  }

  /**
   * 2. Check Unit Balance
   * Retrieves the current available SMS unit balance.
   */
  public static async getBalance() {
    try {
      const response = await axios.get(`${this.baseUrl}/user/balance`, {
        headers: this.getHeaders(),
      })

      return response.data.available_units
    } catch (error: any) {
      console.error('Skezzole Check Balance Error:', error.response?.data || error.message)
      throw new Exception('Failed to retrieve SMS unit balance.', { status: 500 })
    }
  }

  /**
   * 3. Check Message Status
   * @param requestId - The unique ID returned from a successful sendSms request
   */
  public static async checkStatus(requestId: string | number) {
    try {
      const response = await axios.get(`${this.baseUrl}/sms/status/${requestId}`, {
        headers: this.getHeaders(),
      })

      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Exception('Message status not found. Invalid Request ID.', { status: 404 })
      }
      if (error.response?.status === 403) {
        throw new Exception('Unauthorized to view this message status.', { status: 403 })
      }

      console.error('Skezzole Check Status Error:', error.response?.data || error.message)
      throw new Exception('Failed to fetch SMS delivery status.', { status: 500 })
    }
  }
}
