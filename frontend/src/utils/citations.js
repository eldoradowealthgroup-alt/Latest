// Hardcoded Citation Data - Exact same as original backend

export const VALID_CITATIONS = {
  // Citation 1: 87911938C - Total $12,350.50
  '87911938c': {
    found: true,
    citations: [
      { citation_id: '18 U.S.C. § 3146', offense: 'FAILURE TO APPEAR', fine: '$2,133.75', status: 'Outstanding' },
      { citation_id: '18 U.S.C. § 401', offense: 'FAILURE TO COMPLY', fine: '$2,202.75', status: 'Outstanding' },
      { citation_id: '18 U.S.C. § 1503', offense: 'CONTEMPT OF COURT', fine: '$1,607.00', status: 'Outstanding' },
      { citation_id: '18 U.S.C. § 2599', offense: 'INTERFERING WITH JUDICIAL PROCEEDINGS', fine: '$6,407.00', status: 'Outstanding' }
    ],
    total: '$12,350.50'
  },
  
  // Citation 2: 85379536F - Total $2,500.00
  '85379536f': {
    found: true,
    citations: [
      { citation_id: '18 U.S.C. § 3146', offense: 'FAILURE TO APPEAR', fine: '$625.00', status: 'Outstanding' },
      { citation_id: '18 U.S.C. § 401', offense: 'FAILURE TO COMPLY', fine: '$625.00', status: 'Outstanding' },
      { citation_id: '18 U.S.C. § 1503', offense: 'CONTEMPT OF COURT', fine: '$625.00', status: 'Outstanding' },
      { citation_id: '18 U.S.C. § 2599', offense: 'INTERFERING WITH JUDICIAL PROCEEDINGS', fine: '$625.00', status: 'Outstanding' }
    ],
    total: '$2,500.00'
  },
  
  // Citation 3: 41052012F - Total $3,000.00
  '41052012f': {
    found: true,
    citations: [
      { citation_id: '18 U.S.C. § 3146', offense: 'FAILURE TO APPEAR/ABSCONDING', fine: '$1,500.00', status: 'Outstanding' },
      { citation_id: '18 U.S.C. § 2250', offense: 'FAILURE TO REGISTER', fine: '$1,500.00', status: 'Outstanding' }
    ],
    total: '$3,000.00'
  }
};

// Search for citation - returns exact same results as backend
export const searchCitation = (citationNumber) => {
  const normalized = citationNumber.toLowerCase().trim();
  const result = VALID_CITATIONS[normalized];
  
  if (result) {
    const currentDate = new Date().toLocaleDateString('en-US');
    return {
      found: true,
      citations: result.citations.map(c => ({
        ...c,
        date: currentDate
      }))
    };
  }
  
  return {
    found: false,
    message: 'No record found'
  };
};

// Calculate total fines
export const calculateTotal = (citations) => {
  if (!citations || citations.length === 0) return 0;
  return citations.reduce((sum, c) => {
    const fine = parseFloat(c.fine.replace(/[$,]/g, ''));
    return sum + fine;
  }, 0);
};
