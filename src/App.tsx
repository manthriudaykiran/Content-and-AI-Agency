import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuditModal } from './components/AuditModal';
import { DemoStoryModal } from './components/DemoStoryModal';
import { AgentInspectorModal } from './components/AgentInspectorModal';
import { ExcelSyncModal } from './components/ExcelSyncModal';
import { SupabaseDemoModal } from './components/SupabaseDemoModal';
import { DatabaseSyncDrawer } from './components/DatabaseSyncDrawer';
import { RecordInspectorModal } from './components/RecordInspectorModal';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { CommandCenter } from './components/pages/CommandCenter';
import { ContentOS } from './components/pages/ContentOS';
import { ContentCalendar } from './components/pages/ContentCalendar';
import { ClientAcquisition } from './components/pages/ClientAcquisition';
import { Outreach } from './components/pages/Outreach';
import { CRM } from './components/pages/CRM';
import { Sales } from './components/pages/Sales';
import { ClientOnboarding } from './components/pages/ClientOnboarding';
import { DeliveryCoordination } from './components/pages/DeliveryCoordination';
import { Finance } from './components/pages/Finance';
import { Orchestration } from './components/pages/Orchestration';
import { Intel } from './components/pages/Intel';
import { KnowledgeBase } from './components/pages/KnowledgeBase';
import { Settings } from './components/pages/Settings';

const AppContent: React.FC = () => {
  const {
    activeTab,
    isSupabaseDemoModalOpen,
    setIsSupabaseDemoModalOpen,
    isDatabaseSyncOpen,
    setIsDatabaseSyncOpen,
    inspectedRecord,
    setInspectedRecord,
  } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'command-center':
        return <CommandCenter />;
      case 'content-os':
        return <ContentOS />;
      case 'content-calendar':
        return <ContentCalendar />;
      case 'client-acquisition':
        return <ClientAcquisition />;
      case 'outreach':
        return <Outreach />;
      case 'crm':
        return <CRM />;
      case 'sales':
        return <Sales />;
      case 'client-onboarding':
        return <ClientOnboarding />;
      case 'delivery-coordination':
        return <DeliveryCoordination />;
      case 'finance':
        return <Finance />;
      case 'orchestration':
        return <Orchestration />;
      case 'intel':
        return <Intel />;
      case 'knowledge-base':
        return <KnowledgeBase />;
      case 'settings':
        return <Settings />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080a0f] text-slate-100">
      {/* 14-item Persistent Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <AuditModal />
      <DemoStoryModal />
      <AgentInspectorModal />
      <ExcelSyncModal />
      <SupabaseDemoModal
        isOpen={isSupabaseDemoModalOpen}
        onClose={() => setIsSupabaseDemoModalOpen(false)}
      />
      <DatabaseSyncDrawer
        isOpen={isDatabaseSyncOpen}
        onClose={() => setIsDatabaseSyncOpen(false)}
        onInspectRecord={(rec) => setInspectedRecord(rec)}
      />
      <RecordInspectorModal
        record={inspectedRecord}
        onClose={() => setInspectedRecord(null)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
