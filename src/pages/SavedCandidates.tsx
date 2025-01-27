import React, { useState, useEffect } from 'react';
import { ICandidate } from '../interfaces/Candidate.interface';

const SavedList: React.FC = () => {
  const [candidatesList, setCandidatesList] = useState<ICandidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAttribute, setSortAttribute] = useState<string | null>(null);
  const [ascendingOrder, setAscendingOrder] = useState(true);

  const handleRemoveFromList = (username: string) => {
    const updatedList = candidatesList.filter(
      (candidate) => candidate.userLogin !== username
    );
    setCandidatesList(updatedList);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedList));
  };

  const handleSortCandidates = (field: string) => {
    if (sortAttribute === field) {
      setAscendingOrder(!ascendingOrder);
    } else {
      setSortAttribute(field);
      setAscendingOrder(true);
    }
  };

  const filteredCandidates = () => {
    let filtered = [...candidatesList];

    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      filtered = filtered.filter((candidate) => {
        return (
          candidate.fullName?.toLowerCase().includes(queryLower) ||
          candidate.userLogin?.toLowerCase().includes(queryLower) ||
          candidate.userLocation?.toLowerCase().includes(queryLower) ||
          candidate.contactEmail?.toLowerCase().includes(queryLower) ||
          candidate.companyName?.toLowerCase().includes(queryLower)
        );
      });
    }

    if(sortAttribute){
        filtered.sort((a, b) => {
            const aValue = a[sortAttribute as keyof ICandidate];
            const bValue = b[sortAttribute as keyof ICandidate];
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return ascendingOrder ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number'){
              return ascendingOrder ? aValue - bValue : bValue - aValue;
            } else {
              return 0;
            }
          });
    }

    return filtered;
  };

  useEffect(() => {
    const storedCandidates = localStorage.getItem('savedCandidates');
    if (storedCandidates) {
      try {
        const parsed = JSON.parse(storedCandidates) as ICandidate[];
        setCandidatesList(parsed);
      } catch (error) {
        console.error('Error parsing stored candidates:', error);
        localStorage.removeItem('savedCandidates');
        alert("An error occurred while loading saved candidates. Local storage has been cleared.");
      }
    }
  }, []);

  const candidatesToDisplay = filteredCandidates();

  if (candidatesList.length === 0) {
    return (
      <div>
        <h1>Saved Candidates</h1>
        <p>No candidates match the filter criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Saved Candidates</h1>

      {candidatesToDisplay.length === 0 && <p>No candidates match the filter criteria.</p>}
      
      <input
        className='search-bar'
        type="text"
        placeholder="Search candidates..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      <table className="table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th onClick={() => handleSortCandidates('fullName')}>
              Name {sortAttribute === 'fullName' && (ascendingOrder ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSortCandidates('userLogin')}>
              Username {sortAttribute === 'userLogin' && (ascendingOrder ? '▲' : '▼')}
            </th>
            <th>Location</th>
            <th onClick={() => handleSortCandidates('contactEmail')}>
              Email {sortAttribute === 'contactEmail' && (ascendingOrder ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSortCandidates('profileUrl')}>
              GitHub URL {sortAttribute === 'profileUrl' && (ascendingOrder ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSortCandidates('companyName')}>
              Company {sortAttribute === 'companyName' && (ascendingOrder ? '▲' : '▼')}
            </th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {candidatesToDisplay.map((candidate) => (
            <tr key={candidate.userId}>
              <td><img className='table-img' src={candidate.avatarUrl} alt={candidate.fullName}/></td>
              <td>{candidate.fullName}</td>
              <td>{candidate.userLogin}</td>
              <td>{candidate.userLocation}</td>
              <td><a href={`mailto:${candidate.contactEmail}`}>{candidate.contactEmail}</a></td>
              <td><a href={candidate.profileUrl} target='_blank'>{candidate.profileUrl}</a></td>
              <td>{candidate.companyName}</td>
              <td><button onClick={() => handleRemoveFromList(candidate.userLogin)}>-</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedList;
