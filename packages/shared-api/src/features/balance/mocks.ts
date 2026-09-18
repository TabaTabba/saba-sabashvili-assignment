import { failIfFaulty } from '../../lib/faults'
import { latency } from '../../lib/latency'
import type { BalanceResponse } from './types'

const STARTING_AMOUNT = 1284.5

let amount = STARTING_AMOUNT

export async function fetchBalance(userId: string): Promise<BalanceResponse> {
  await latency()
  failIfFaulty('balance', 'Could not reach the wallet service')

  amount = Math.round((amount + (Math.random() * 120 - 40)) * 100) / 100

  return {
    userId,
    amount,
    currency: 'EUR',
    updatedAt: new Date().toISOString(),
  }
}

export function resetBalanceMock() {
  amount = STARTING_AMOUNT
}
