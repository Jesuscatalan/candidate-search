import React, { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { ICandidate } from '../interfaces/Candidate.interface';

const CandidateFinder: React.FC = () => {
  const [candidateList, setCandidateList] = useState<ICandidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedList, setSavedList] = useState<ICandidate[]>([]);
  const [detailFetched, setDetailFetched] = useState<number | null>(null);
  const maxResults = 10;

  const loadCandidates = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const candidates: ICandidate[] = await searchGithub();
      if (!Array.isArray(candidates)) {
        throw new Error("Received invalid data from API.");
      }
      const validCandidates = candidates.filter((candidate): candidate is ICandidate => candidate.userLogin && candidate.profileUrl); // Filter out incomplete entries
      const limitedCandidates = validCandidates.slice(0, maxResults);

      setCandidateList(limitedCandidates);
    } catch (error) {
      console.error('Error loading candidates:', error);
      setErrorMsg('Error loading candidates, try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCandidateDetails = async (candidate: ICandidate) => {
    try {
      const detailed = await searchGithubUser(candidate.userLogin);
      return detailed;
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      return null;
    }
  };

  const handleSaveCandidate = (candidate: ICandidate) => {
    if (candidate) {
      const updatedSavedList = [...savedList, candidate];
      setSavedList(updatedSavedList);
      localStorage.setItem('savedCandidates', JSON.stringify(updatedSavedList));
      goToNext();
    }
  };

  const handleRemoveFromList = () => {
    goToNext();
  };

  const goToNext = () => {
    if (currentIndex < candidateList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCandidateList([]); // Clear list once all candidates are viewed
    }
  };

  useEffect(() => {
    const storedSavedCandidates = localStorage.getItem('savedCandidates');
    if (storedSavedCandidates) {
      try {
        const parsedSaved = JSON.parse(storedSavedCandidates) as ICandidate[];
        setSavedList(parsedSaved);
      } catch (error) {
        console.error('Error parsing saved candidates:', error);
        localStorage.removeItem('savedCandidates');
      }
    }

    loadCandidates();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (candidateList.length > 0 && detailFetched !== currentIndex) {
        const candidateWithDetails = await loadCandidateDetails(candidateList[currentIndex]);
        if (candidateWithDetails) {
          setCandidateList(prevList =>
            prevList.map((candidate, index) =>
              index === currentIndex ? candidateWithDetails : candidate
            )
          );
        }
        setDetailFetched(currentIndex);
      }
    };

    fetchDetails();
  }, [candidateList, currentIndex, detailFetched]);

  const currentCandidate = candidateList.length > 0 ? candidateList[currentIndex] : null;

  return (
    <div className="candidate-finder">
      <h1>Candidate Search</h1>
      <div className="candidate-container">
        {loading ? (
          <p>Loading...</p>
        ) : errorMsg ? (
          <p className="error-message">{errorMsg}</p>
        ) : currentCandidate ? (
          <div key={currentCandidate.userLogin} className="candidate-card">
            <img
              src={currentCandidate.avatarUrl || 'https://placehold.co/400'}
              alt={currentCandidate.fullName || 'No image'} />
            <div className="card-info">
              <h3>{currentCandidate.fullName}</h3>
              <p>Username: {currentCandidate.userLogin}</p>
              <p>Location: {currentCandidate.userLocation || 'N/A'}</p>
              <p>Email: {currentCandidate.contactEmail ? <a href={`mailto:${currentCandidate.contactEmail}`}>{currentCandidate.contactEmail}</a> : 'N/A'}</p>
              <p>GitHub: <a href={currentCandidate.profileUrl || 'N/A'} target='_blank'>{currentCandidate.profileUrl}</a></p>
              <p>Company: {currentCandidate.companyName || 'N/A'}</p>
            </div>
            <div className="action-buttons">
              <button onClick={handleRemoveFromList}>Skip</button>
              <button onClick={() => handleSaveCandidate(currentCandidate)}>Save</button>
            </div>
          </div>
        ) : candidateList.length === 0 ? (
          <p>No candidates left. Refresh the page to get more candidates.</p>
        ) : (
          <p>No candidates available.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateFinder;
