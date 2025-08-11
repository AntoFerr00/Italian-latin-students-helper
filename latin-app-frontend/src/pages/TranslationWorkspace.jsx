import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { fetchTextById, nextStep, resetTranslation } from '../redux/translationSlice';

const TranslationWorkspace = () => {
  const dispatch = useDispatch();
  const { textId } = useParams();
  const { text, status, currentStep } = useSelector((state) => state.translation);

  // State for Step 1
  const [selectedVerbs, setSelectedVerbs] = useState([]);
  // State for Step 2
  const [selectedMainVerb, setSelectedMainVerb] = useState(null);
  // State for Step 3
  const [verbAnalysis, setVerbAnalysis] = useState({ voice: '', person: '', number: '' });
  // State for Step 4
  const [selectedSubject, setSelectedSubject] = useState(null);
  // State for Step 5
  const [draftTranslation, setDraftTranslation] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (textId) {
      dispatch(fetchTextById(textId));
    }

    // This "cleanup function" runs when the user navigates away from this page.
    return () => {
      dispatch(resetTranslation());
    };
  }, [dispatch, textId]);

  // --- Main Click Handler for the Latin Text ---
  const handleWordClick = (word, index) => {
    const wordIdentifier = `${word}-${index}`;

    if (currentStep === 1) {
      // Logic for verb selection (allows multiple selections)
      if (selectedVerbs.includes(wordIdentifier)) {
        setSelectedVerbs(selectedVerbs.filter(v => v !== wordIdentifier));
      } else {
        setSelectedVerbs([...selectedVerbs, wordIdentifier]);
      }
    } else if (currentStep === 4) {
      // Logic for subject selection (allows single selection)
      setSelectedSubject(wordIdentifier);
    }
  };

  // --- Handlers for Step 1 ---
  const handleSubmitVerbs = () => {
    const userSelectedCleanWords = selectedVerbs.map(v =>
      v.split('-')[0].replace(/[.,;:]/g, '').toLowerCase()
    );
    const correctCleanVerbs = text.analysis.verbs.map(v => v.toLowerCase());
    const isCorrect = JSON.stringify(userSelectedCleanWords.sort()) === JSON.stringify(correctCleanVerbs.sort());
    
    if (isCorrect) {
      alert('Correcto! Ottimo lavoro nel trovare i verbi.');
      dispatch(nextStep());
    } else {
      alert('Non esattamente. Rivedi il testo e riprova.');
    }
  };

  // --- Handlers for Step 2 ---
  const handleMainVerbSelect = (verb) => {
    setSelectedMainVerb(verb);
  };

  const handleSubmitMainVerb = () => {
    if (!selectedMainVerb) {
      alert('Per favore, seleziona un verbo.');
      return;
    }
    if (selectedMainVerb === text.analysis.mainVerb) {
      alert('Perfetto! Hai identificato il verbo principale.');
      dispatch(nextStep());
    } else {
      alert('Non è quello corretto. Il verbo principale di solito ha un modo finito (come l\'indicativo) e regge la frase.');
    }
  };

  // --- Handlers for Step 3 ---
  const handleAnalysisChange = (e) => {
    const { name, value } = e.target;
    setVerbAnalysis(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAnalysis = () => {
    const correct = text.analysis.mainVerbAnalysis;
    if (!correct || !correct.voice || !correct.person || !correct.number) {
      alert("Errore: i dati di analisi nel database sono incompleti. Controlla che le chiavi 'voice', 'person', e 'number' esistano.");
      return;
    }
    if (
      verbAnalysis.voice === correct.voice.trim() &&
      verbAnalysis.person === correct.person.trim() &&
      verbAnalysis.number === correct.number.trim()
    ) {
      alert('Analisi corretta!');
      dispatch(nextStep());
    } else {
      alert('Qualcosa non è corretto. Riprova.');
    }
  };

  // --- Handlers for Step 4 ---
  const handleSubmitSubject = () => {
    if (!selectedSubject) {
      alert("Per favore, seleziona il soggetto.");
      return;
    }
    const subjectWord = selectedSubject.split('-')[0].replace(/[.,;:]/g, '').toLowerCase();
    const correctSubject = text.analysis.subject.toLowerCase();
    if (subjectWord === correctSubject) {
      alert("Corretto! Hai trovato il soggetto.");
      dispatch(nextStep());
    } else {
      alert("Non è esatto. Ricorda che il soggetto concorda con il verbo in persona e numero.");
    }
  };

  // --- Handlers for Step 5 ---
  const handleSubmitTranslation = async () => {
    if (draftTranslation.trim() === '') {
      alert("Per favore, scrivi la tua traduzione.");
      return;
    }
    setIsSubmitting(true);
    setAiFeedback('');

    try {
      const response = await axios.post(`http://localhost:5000/api/texts/${textId}/evaluate`, {
        studentTranslation: draftTranslation
      });
      setAiFeedback(response.data.feedback);
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
      setAiFeedback("Non è stato possibile ricevere il feedback in questo momento. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed' || !text) return <div>Error loading text. Please go back and select a text.</div>;

  // --- Function to Render the UI for the Current Step ---
  const renderCurrentStepUI = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="interactive-step-area">
            <h2>Passo 1: Trova i Verbi</h2>
            <p>Verbi Selezionati: {selectedVerbs.length}</p>
            <button onClick={handleSubmitVerbs}>Invia Verbi</button>
          </div>
        );
      case 2:
        return (
          <div className="interactive-step-area">
            <h2>Passo 2: Identifica il Verbo Principale</h2>
            <p>Ora, scegli il verbo della proposizione principale tra quelli che hai trovato.</p>
            <div>
              {text.analysis.verbs.map(verb => (
                <button
                  key={verb}
                  onClick={() => handleMainVerbSelect(verb)}
                  className={selectedMainVerb === verb ? 'selected-main' : ''}
                >
                  {verb}
                </button>
              ))}
            </div>
            <button onClick={handleSubmitMainVerb} style={{ marginTop: '10px' }}>Invia Verbo Principale</button>
          </div>
        );
      case 3:
        return (
          <div className="interactive-step-area">
            <h2>Passo 3: Analisi del Verbo Principale "{text.analysis.mainVerb}"</h2>
            <div className="analysis-form">
              <label> Diatesi (Voice):
                <select name="voice" value={verbAnalysis.voice} onChange={handleAnalysisChange}>
                  <option value="">Seleziona...</option>
                  <option value="Attivo">Attivo</option>
                  <option value="Passivo">Passivo</option>
                  <option value="Deponente">Deponente</option>
                </select>
              </label>
              <label> Persona:
                <select name="person" value={verbAnalysis.person} onChange={handleAnalysisChange}>
                  <option value="">Seleziona...</option>
                  <option value="1a">1a</option>
                  <option value="2a">2a</option>
                  <option value="3a">3a</option>
                </select>
              </label>
              <label> Numero:
                <select name="number" value={verbAnalysis.number} onChange={handleAnalysisChange}>
                  <option value="">Seleziona...</option>
                  <option value="Singolare">Singolare</option>
                  <option value="Plurale">Plurale</option>
                </select>
              </label>
            </div>
            <button onClick={handleSubmitAnalysis} style={{ marginTop: '10px' }}>Invia Analisi</button>
          </div>
        );
      case 4:
        return (
          <div className="interactive-step-area">
             <h2>Passo 4: Trova il Soggetto</h2>
             <p>In base alla tua analisi (3a persona singolare), trova il soggetto del verbo principale.</p>
             <button onClick={handleSubmitSubject}>Invia Soggetto</button>
          </div>
        );
      case 5:
        return (
           <div className="interactive-step-area">
             <h2>Passo 5: Prima bozza di traduzione</h2>
             <p>Ora, metti insieme i pezzi e scrivi una prima traduzione della frase.</p>
             <textarea
               value={draftTranslation}
               onChange={(e) => setDraftTranslation(e.target.value)}
               rows="5"
               style={{ width: '100%', padding: '8px', fontSize: '1rem', marginTop: '10px' }}
               placeholder="Scrivi qui la tua traduzione..."
             />
             <button onClick={handleSubmitTranslation} disabled={isSubmitting} style={{ marginTop: '10px' }}>
               {isSubmitting ? 'Valutazione in corso...' : 'Invia Traduzione per Valutazione'}
             </button>

             {aiFeedback && (
                <div className="feedback-container" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h3>Risultati</h3>
                    <div className="comparison" style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <h4>La tua Traduzione:</h4>
                            <p>{draftTranslation}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4>Traduzione dell'esperto:</h4>
                            <p>{text.analysis.expertTranslation}</p>
                        </div>
                    </div>
                    <hr/>
                    <h4>Feedback dall'IA: 🤖</h4>
                    <p>{aiFeedback}</p>
                </div>
             )}
           </div>
        );
      default:
        return <h2>Congratulazioni, hai completato l'esercizio!</h2>;
    }
  };

  // --- Main Component Render ---
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/">&larr; Torna alla lista dei testi</Link>
      </div>
      
      <h1>{text.title}</h1>
      <p><i>di {text.author}</i></p>
      <hr />
      <div className="latin-text-display">
        {text.content.split(' ').map((word, index) => {
          let className = '';
          const wordIdentifier = `${word}-${index}`;
          if (currentStep === 1 && selectedVerbs.includes(wordIdentifier)) {
            className = 'selected';
          } else if (currentStep === 4 && selectedSubject === wordIdentifier) {
            className = 'selected-main';
          }
          
          return (
            <span
              key={wordIdentifier}
              className={className}
              onClick={() => handleWordClick(word, index)}
            >
              {word}{' '}
            </span>
          );
        })}
      </div>
      {renderCurrentStepUI()}
    </div>
  );
};

export default TranslationWorkspace;