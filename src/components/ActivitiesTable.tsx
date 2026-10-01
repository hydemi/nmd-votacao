import React, { useState } from 'react';
import { ChangeTask, TaskCategory } from '../types/cab';
import { 
  Database, 
  Rocket, 
  Server, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Filter
} from 'lucide-react';

interface ActivitiesTableProps {
  tasks: ChangeTask[];
}

const CATEGORY_CONFIG: Record<TaskCategory, { label: string; icon: React.ReactNode; badgeClass: string; borderClass: string }> = {
  'DML': {
    label: 'DML / Banco de Dados',
    icon: <Database className="w-4 h-4 text-white" />,
    badgeClass: 'text-white bg-[#002860] border border-sky-400/40',
    borderClass: 'border-l-[#003882]',
  },
  'Deploy': {
    label: 'Deploy de Aplicações',
    icon: <Rocket className="w-4 h-4 text-white" />,
    badgeClass: 'text-white bg-[#002860] border border-sky-400/40',
    borderClass: 'border-l-[#003882]',
  },
  'Configuração de Infra': {
    label: 'Configuração de Infraestrutura & Servidores',
    icon: <Server className="w-4 h-4 text-white" />,
    badgeClass: 'text-white bg-[#002860] border border-sky-400/40',
    borderClass: 'border-l-[#003882]',
  },
  'Firewall e Redes': {
    label: 'Firewall, Redes & Segurança Perimetral',
    icon: <ShieldCheck className="w-4 h-4 text-white" />,
    badgeClass: 'text-white bg-[#002860] border border-sky-400/40',
    borderClass: 'border-l-[#003882]',
  },
  'Testes de Fumaça': {
    label: 'Testes de Fumaça & Homologação',
    icon: <CheckCircle2 className="w-4 h-4 text-white" />,
    badgeClass: 'text-white bg-[#002860] border border-sky-400/40',
    borderClass: 'border-l-[#003882]',
  },
};

export const ActivitiesTable: React.FC<ActivitiesTableProps> = ({ tasks }) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Group tasks by category
  const categoriesPresent = Array.from(new Set(tasks.map(t => t.categoria))) as TaskCategory[];

  const filteredCategories = selectedCategory === 'all' 
    ? categoriesPresent 
    : categoriesPresent.filter(c => c === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Category filter tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#CCE2F2]">
        <div className="flex items-center gap-2 text-xs text-[#003882]">
          <Filter className="w-3.5 h-3.5 text-[#00A3E0]" />
          <span className="font-bold text-[#003882]">Filtrar por Categoria Técnica:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#003882] text-white font-semibold shadow-xs'
                : 'bg-[#F0F6FB] text-[#003882] hover:bg-[#E2EEF8] border border-[#CCE2F2]'
            }`}
          >
            Todas ({tasks.length} tarefas)
          </button>
          {categoriesPresent.map(cat => {
            const count = tasks.filter(t => t.categoria === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#003882] text-white font-semibold shadow-xs'
                    : 'bg-[#F0F6FB] text-[#003882] hover:bg-[#E2EEF8] border border-[#CCE2F2]'
                }`}
              >
                <span>{cat}</span>
                <span className={`font-mono text-[11px] ${selectedCategory === cat ? 'text-sky-200' : 'text-[#00A3E0]'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped categories list */}
      <div className="space-y-3">
        {filteredCategories.map(cat => {
          const catTasks = tasks.filter(t => t.categoria === cat);
          const config = CATEGORY_CONFIG[cat] || {
            label: cat,
            icon: <Server className="w-4 h-4 text-white" />,
            badgeClass: 'text-white bg-[#002860] border border-sky-400/40',
            borderClass: 'border-l-[#003882]',
          };
          const isCollapsed = !!collapsedCategories[cat];

          return (
            <div 
              key={cat} 
              className={`bg-white border border-[#CCE2F2] rounded-lg overflow-hidden shadow-xs border-l-4 ${config.borderClass}`}
            >
              {/* Category Header: Fundo azul mais sólido do Banco BRB */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#003882] hover:bg-[#002c6b] transition-colors text-left text-white"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded bg-[#002554] border border-sky-400/30">
                    {config.icon}
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide">{config.label}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${config.badgeClass}`}>
                    {catTasks.length} {catTasks.length === 1 ? 'atividade' : 'atividades'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sky-200">
                  <span className="text-xs font-medium">
                    {isCollapsed ? 'Expandir' : 'Recolher'}
                  </span>
                  {isCollapsed ? <ChevronDown className="w-4 h-4 text-sky-300" /> : <ChevronUp className="w-4 h-4 text-sky-300" />}
                </div>
              </button>

              {/* Tasks Table: Linha seguinte em azul mais claro padrão BRB */}
              {!isCollapsed && (
                <div className="overflow-x-auto border-t border-[#CCE2F2]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#EBF4FA] text-[#003882] border-b border-[#CCE2F2]">
                        <th className="py-2.5 px-3 font-bold text-center w-12 text-[#003882]">#</th>
                        <th className="py-2.5 px-3 font-bold min-w-[240px] text-[#003882]">Descrição da Atividade</th>
                        <th className="py-2.5 px-3 font-bold whitespace-nowrap min-w-[140px] text-[#003882]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#00A3E0]" />
                            <span>Janela / Horário</span>
                          </div>
                        </th>
                        <th className="py-2.5 px-3 font-bold whitespace-nowrap min-w-[150px] text-[#003882]">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#00A3E0]" />
                            <span>Grupo Designado</span>
                          </div>
                        </th>
                        <th className="py-2.5 px-3 font-bold whitespace-nowrap min-w-[150px] text-[#003882]">Responsável Técnico</th>
                        <th className="py-2.5 px-3 font-bold text-center w-24 text-[#003882]">Risco</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2EEF8]">
                      {catTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-[#F2F7FC] transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono text-[#004b93] font-semibold">
                            {task.ordem}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900 leading-snug">{task.descricao}</div>
                            <div className="font-mono text-[10px] text-[#00A3E0] mt-0.5 font-medium">{task.id}</div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-800 tabular-nums whitespace-nowrap">
                            <span className="text-emerald-700 font-bold">{task.inicio}</span>
                            <span className="text-slate-400 mx-1">→</span>
                            <span className="text-amber-700 font-bold">{task.termino}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-800">
                            <span className="px-2 py-0.5 bg-[#F0F6FB] rounded text-[11px] font-medium text-[#003882] border border-[#CCE2F2] inline-block">
                              {task.grupoDesignado}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-900 font-medium">
                            {task.responsavel}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              task.riscoEstimado === 'Alto'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : task.riscoEstimado === 'Médio'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {task.riscoEstimado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
