import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../app/store/useAppStore';
import { HistoryList } from '../shared/components/HistoryList';
import { Modal } from '../shared/components/Modal';
import { AnalyticsResult } from '../shared/components/AnalyticsResult/AnalyticsResult';
import { Button } from '../shared/components/Button/Button';
import { HistoryEntry } from '../shared/types';

export const HistoryPage = () => {
  const { history, removeHistoryEntry, clearHistory } = useAppStore();
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const navigate = useNavigate();

  return (
    <div>
      <HistoryList
        history={history}
        onItemClick={setSelectedEntry}
        onItemDelete={removeHistoryEntry}
      />
      <Button onClick={clearHistory} disabled={history.length === 0} variant="download">
        Очистить историю
      </Button>
      <Button
        onClick={() => navigate('/generate')}
        variant="ready"
        style={{ marginTop: '10px', marginLeft: '1rem', marginBottom: '1rem' }}
      >
        Сгенерировать больше
      </Button>
      <Modal isOpen={!!selectedEntry} onClose={() => setSelectedEntry(null)}>
        {selectedEntry && <AnalyticsResult result={selectedEntry} />}
      </Modal>
    </div>
  );
};
