import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock contract state
let donations = new Map();
let charities = new Map();

// Mock functions for other contracts
const mockGetCharity = vi.fn();
const mockUpdateTotalDonations = vi.fn();

// Mock contract functions
const recordDonation = (charityId: number, amount: number, sender: string) => {
  const charity = mockGetCharity(charityId);
  if (!charity) return { type: 'err', value: 404 };
  
  const key = `${charityId}-${sender}`;
  donations.set(key, { amount, timestamp: Date.now() });
  
  mockUpdateTotalDonations(charityId, amount);
  
  return { type: 'ok', value: true };
};

const getDonation = (charityId: number, donor: string) => {
  const key = `${charityId}-${donor}`;
  return donations.get(key) || null;
};

const getTotalDonations = (charityId: number) => {
  const charity = mockGetCharity(charityId);
  if (!charity) return { type: 'err', value: 404 };
  return { type: 'ok', value: charity.totalDonations };
};

describe('Donation Tracker', () => {
  beforeEach(() => {
    donations.clear();
    charities.clear();
    
    // Reset mock functions
    mockGetCharity.mockReset();
    mockUpdateTotalDonations.mockReset();
    
    // Set up mock charity
    mockGetCharity.mockImplementation((id) => {
      if (id === 0) return { id: 0, name: 'Test Charity', totalDonations: 0 };
      return null;
    });
    
    mockUpdateTotalDonations.mockImplementation((id, amount) => {
      const charity = mockGetCharity(id);
      if (charity) {
        charity.totalDonations += amount;
      }
    });
  });
  
  it('should allow recording a donation', () => {
    const result = recordDonation(0, 1000, 'donor1');
    expect(result.type).toBe('ok');
    expect(result.value).toBe(true);
    expect(mockUpdateTotalDonations).toHaveBeenCalledWith(0, 1000);
  });
  
  it('should fail to record a donation for non-existent charity', () => {
    const result = recordDonation(999, 1000, 'donor1');
    expect(result.type).toBe('err');
    expect(result.value).toBe(404);
    expect(mockUpdateTotalDonations).not.toHaveBeenCalled();
  });
  
  it('should allow retrieving a donation', () => {
    recordDonation(0, 1000, 'donor1');
    const donation = getDonation(0, 'donor1');
    expect(donation).not.toBeNull();
    expect(donation?.amount).toBe(1000);
  });
  
  it('should return null for non-existent donation', () => {
    const donation = getDonation(0, 'non-existent-donor');
    expect(donation).toBeNull();
  });
  
  it('should fail to retrieve total donations for non-existent charity', () => {
    const result = getTotalDonations(999);
    expect(result.type).toBe('err');
    expect(result.value).toBe(404);
  });
});

