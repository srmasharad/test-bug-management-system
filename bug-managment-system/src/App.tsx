import {
  BarChart3,
  Bug,
  Clipboard,
  FileText,
  FlaskConical,
  FolderKanban,
  Users,
} from 'lucide-react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import BugsTab from './components/BugsTab';
import ChartsTab from './components/ChartsTab';
import ProjectsTab from './components/ProjectsTab';
import ReportsTab from './components/ReportsTab';
import TestCasesTab from './components/TestCasesTab';
import TestersTab from './components/TestersTab';
import TestSuitesTab from './components/TestSuitesTab';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FlaskConical className="h-8 w-8 text-blue-600" />
            Test Management & Bug Tracking System
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Comprehensive testing and defect management solution
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="testers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Testers
            </TabsTrigger>
            <TabsTrigger value="testsuites" className="flex items-center gap-2">
              <Clipboard className="h-4 w-4" />
              Test Suites
            </TabsTrigger>
            <TabsTrigger value="testcases" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Test Cases
            </TabsTrigger>
            <TabsTrigger value="bugs" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Bugs
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Charts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectsTab />
          </TabsContent>

          <TabsContent value="testers">
            <TestersTab />
          </TabsContent>

          <TabsContent value="testsuites">
            <TestSuitesTab />
          </TabsContent>

          <TabsContent value="testcases">
            <TestCasesTab />
          </TabsContent>

          <TabsContent value="bugs">
            <BugsTab />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="charts">
            <ChartsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
