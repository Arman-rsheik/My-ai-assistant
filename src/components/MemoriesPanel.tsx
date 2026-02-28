import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, Trash2, Tag, Clock, BookOpen, Bell, Lightbulb, Filter } from 'lucide-react';
import { MemoryEntry, loadMemories, addMemory, deleteMemory } from '../lib/avaCore';

const categoryConfig = {
  update: { label: 'Update', icon: <Lightbulb size={14} />, color: '#00e5ff' },
  journal: { label: 'Journal', icon: <BookOpen size={14} />, color: '#b388ff' },
  reminder: { label: 'Reminder', icon: <Bell size={14} />, color: '#ff80ab' },
  fact: { label: 'Fact', icon: <Tag size={14} />, color: '#69f0ae' },
};

export default function MemoriesPanel() {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryEntry['category']>('update');
  const [filter, setFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setMemories(loadMemories());
  }, []);

  const handleAdd = () => {
    if (!newContent.trim()) return;
    const entry = addMemory(newContent.trim(), newCategory);
    setMemories(prev => [...prev, entry]);
    setNewContent('');
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    deleteMemory(id);
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const filteredMemories = filter === 'all'
    ? memories
    : memories.filter(m => m.category === filter);

  const sortedMemories = [...filteredMemories].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b border-ava-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-ava-cyan flex items-center gap-2">
              <Brain size={20} />
              AVA's Memory Bank
            </h2>
            <p className="text-xs text-ava-text-dim mt-1">
              {memories.length} memories stored • Everything you share, AVA remembers
            </p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="cyber-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-ava-cyan/20 text-ava-cyan border border-ava-cyan/40'
                : 'text-ava-text-dim border border-ava-border hover:border-ava-cyan/30'
            }`}
          >
            <Filter size={12} className="inline mr-1" /> All
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                filter === key
                  ? 'border'
                  : 'text-ava-text-dim border border-ava-border hover:border-ava-cyan/30'
              }`}
              style={filter === key ? { backgroundColor: `${config.color}20`, color: config.color, borderColor: `${config.color}60` } : {}}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Memory */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-ava-border"
          >
            <div className="px-4 md:px-6 py-4 space-y-3 bg-ava-cyan/[0.03]">
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Tell AVA something new... an update about your life, a journal entry, a fact she should remember, or a reminder..."
                className="cyber-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setNewCategory(key as MemoryEntry['category'])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        newCategory === key ? 'border' : 'text-ava-text-dim border border-ava-border'
                      }`}
                      style={newCategory === key ? { backgroundColor: `${config.color}20`, color: config.color, borderColor: `${config.color}60` } : {}}
                    >
                      {config.icon} {config.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!newContent.trim()}
                  className="cyber-button px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Save Memory
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memories List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3">
        {sortedMemories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Brain size={48} className="text-ava-border mb-4" />
            <p className="text-ava-text-dim text-sm">
              {filter === 'all'
                ? 'No memories yet. Start by adding something AVA should remember!'
                : `No ${filter} memories yet.`}
            </p>
          </div>
        ) : (
          sortedMemories.map((memory, index) => {
            const config = categoryConfig[memory.category];
            return (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel rounded-xl p-4 group hover:border-ava-cyan/20 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{ backgroundColor: `${config.color}15`, color: config.color, border: `1px solid ${config.color}30` }}
                      >
                        {config.icon} {config.label}
                      </span>
                      <span className="text-xs text-ava-text-dim flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(memory.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-ava-text leading-relaxed">{memory.content}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(memory.id)}
                    className="p-1.5 rounded-lg text-ava-text-dim opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
