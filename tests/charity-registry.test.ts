import { describe, it, expect, beforeEach } from 'vitest';

// Mock contract state
let charities = new Map();
let donations = new Map();
let impactScores = new Map();
let votes = new Map();
let incentives = new Map();

// Mock contract functions
const registerCharity = (name, description, sender) => {
  const id = charities.size;
  charities.set(id, { name, description, wallet: sender, totalDonations: 0, transparencyScore: 100 });
  return { type: 'ok', value: id };
};

const recordDonation = (charityId, amount, sender) => {
  const key = `${charityId}-${sender}`;
  donations.set(key, { amount, timestamp: Date.now() });
  const charity = charities.get(charityId);
  charity.totalDonations += amount;
  return { type: 'ok', value: true };
};

const updateImpactScore = (charityId, score) => {
  if (score < 0 || score > 100) return { type: 'err', value: 400 };
  impactScores.set(charityId, { score, lastUpdated: Date.now() });
  return { type: 'ok', value: true };
};

const castVote = (charityId, score, sender) => {
  if (score < 0 || score > 100) return { type: 'err', value: 400 };
  const donationKey = `${charityId}-${sender}`;
  const donation = donations.get(donationKey);
  if (!donation) return { type: 'err', value: 404 };
  const key = `${charityId}-${sender}`;
  votes.set(key, { score, weight: donation.amount });
  return { type: 'ok', value: true };
};

const distributeIncentives = () => {
  const totalScore = Array.from(charities.entries()).reduce((sum, [id, charity]) => {
    const impactScore = impactScores.get(id)?.score || 0;
    return sum + impactScore * charity.transparencyScore;
  }, 0);
  
  const INCENTIVE_POOL = 1000000;
  
  charities.forEach((charity, id) => {
    const impactScore = impactScores.get(id)?.score || 0;
    const combinedScore = impactScore * charity.transparencyScore;
    const incentiveAmount = Math.floor((INCENTIVE_POOL * combinedScore) / totalScore);
    incentives.set(id, incentiveAmount);
  });
  
  return { type: 'ok', value: true };
};

describe('Decentralized Autonomous Charity Evaluator', () => {
  beforeEach(() => {
    charities.clear();
    donations.clear();
    impactScores.clear();
    votes.clear();
    incentives.clear();
  });
  
  it('should allow registering a charity', () => {
    const result = registerCharity('Test Charity', 'A test charity', 'wallet1');
    expect(result.type).toBe('ok');
    expect(result.value).toBe(0);
    expect(charities.size).toBe(1);
  });
  
  it('should allow recording donations', () => {
    registerCharity('Test Charity', 'A test charity', 'wallet1');
    const result = recordDonation(0, 1000, 'donor1');
    expect(result.type).toBe('ok');
    expect(result.value).toBe(true);
    expect(charities.get(0).totalDonations).toBe(1000);
  });
  
  it('should allow updating impact scores', () => {
    registerCharity('Test Charity', 'A test charity', 'wallet1');
    const result = updateImpactScore(0, 80);
    expect(result.type).toBe('ok');
    expect(result.value).toBe(true);
    expect(impactScores.get(0).score).toBe(80);
  });
  
  it('should allow casting votes', () => {
    registerCharity('Test Charity', 'A test charity', 'wallet1');
    recordDonation(0, 1000, 'donor1');
    const result = castVote(0, 90, 'donor1');
    expect(result.type).toBe('ok');
    expect(result.value).toBe(true);
    expect(votes.get('0-donor1').score).toBe(90);
  });
  
  it('should distribute incentives correctly', () => {
    registerCharity('Charity A', 'Description A', 'walletA');
    registerCharity('Charity B', 'Description B', 'walletB');
    updateImpactScore(0, 80);
    updateImpactScore(1, 60);
    distributeIncentives();
    expect(incentives.get(0)).toBeGreaterThan(incentives.get(1));
  });
});

