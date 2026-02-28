import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, Target, Music, Utensils, MapPin, Briefcase, Cake, Palette, Dog, BookOpen, Sparkles, Save, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { PersonalInfo, loadPersonalInfo, savePersonalInfo } from '../lib/avaCore';

interface ProfileField {
  key: keyof PersonalInfo;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: 'text' | 'textarea';
  category: string;
}

const fields: ProfileField[] = [
  { key: 'name', label: 'Full Name', icon: <User size={16} />, placeholder: 'What\'s your name?', category: 'Basic Info' },
  { key: 'nickname', label: 'Nickname', icon: <Sparkles size={16} />, placeholder: 'What should AVA call you?', category: 'Basic Info' },
  { key: 'age', label: 'Age', icon: <User size={16} />, placeholder: 'How old are you?', category: 'Basic Info' },
  { key: 'birthday', label: 'Birthday', icon: <Cake size={16} />, placeholder: 'When\'s your birthday? (e.g., March 15)', category: 'Basic Info' },
  { key: 'gender', label: 'Gender', icon: <User size={16} />, placeholder: 'How do you identify?', category: 'Basic Info' },
  { key: 'location', label: 'Location', icon: <MapPin size={16} />, placeholder: 'Where do you live?', category: 'Basic Info' },
  { key: 'occupation', label: 'Occupation', icon: <Briefcase size={16} />, placeholder: 'What do you do?', category: 'Life' },
  { key: 'relationship', label: 'Relationship Status', icon: <Heart size={16} />, placeholder: 'What\'s your relationship status?', category: 'Life' },
  { key: 'pets', label: 'Pets', icon: <Dog size={16} />, placeholder: 'Do you have any pets?', category: 'Life' },
  { key: 'hobbies', label: 'Hobbies & Interests', icon: <BookOpen size={16} />, placeholder: 'What do you enjoy doing?', type: 'textarea', category: 'Favorites' },
  { key: 'favoriteFood', label: 'Favorite Food', icon: <Utensils size={16} />, placeholder: 'What\'s your favorite food?', category: 'Favorites' },
  { key: 'favoriteMusic', label: 'Favorite Music', icon: <Music size={16} />, placeholder: 'What music do you love?', category: 'Favorites' },
  { key: 'favoriteColor', label: 'Favorite Color', icon: <Palette size={16} />, placeholder: 'What\'s your favorite color?', category: 'Favorites' },
  { key: 'goals', label: 'Goals & Dreams', icon: <Target size={16} />, placeholder: 'What are your goals in life?', type: 'textarea', category: 'Personal' },
  { key: 'fears', label: 'Fears & Challenges', icon: <Heart size={16} />, placeholder: 'What are your fears or challenges?', type: 'textarea', category: 'Personal' },
  { key: 'loveLanguage', label: 'Love Language', icon: <Heart size={16} />, placeholder: 'How do you express and receive love?', category: 'Personal' },
  { key: 'mood', label: 'Current Mood', icon: <Sparkles size={16} />, placeholder: 'How are you feeling today?', category: 'Personal' },
  { key: 'notes', label: 'Extra Notes', icon: <BookOpen size={16} />, placeholder: 'Anything else AVA should know about you...', type: 'textarea', category: 'Personal' },
];

const categories = ['Basic Info', 'Life', 'Favorites', 'Personal'];

export default function ProfilePanel() {
  const [info, setInfo] = useState<PersonalInfo>(loadPersonalInfo());
  const [saved, setSaved] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Basic Info': true,
    'Life': true,
    'Favorites': true,
    'Personal': true,
  });

  useEffect(() => {
    const loaded = loadPersonalInfo();
    setInfo(loaded);
  }, []);

  const handleChange = (key: keyof PersonalInfo, value: string) => {
    setInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    savePersonalInfo(info);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filledFields = Object.values(info).filter(v => v.trim() !== '').length;
  const totalFields = Object.keys(info).length;
  const progressPercent = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b border-ava-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-ava-cyan flex items-center gap-2">
              <User size={20} />
              Your Profile
            </h2>
            <p className="text-xs text-ava-text-dim mt-1">
              The more AVA knows about you, the better friend she becomes
            </p>
          </div>
          <button
            onClick={handleSave}
            className="cyber-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-ava-text-dim mb-1">
            <span>Profile Completeness</span>
            <span className="text-ava-cyan">{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-ava-darker rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00e5ff, #b388ff, #ff80ab)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-ava-text-dim mt-1">
            {filledFields}/{totalFields} fields filled
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
        {categories.map(cat => {
          const catFields = fields.filter(f => f.category === cat);
          const isExpanded = expandedCategories[cat];

          return (
            <div key={cat} className="glass-panel rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-semibold text-ava-purple tracking-wide uppercase">
                  {cat}
                </span>
                {isExpanded ? <ChevronUp size={16} className="text-ava-text-dim" /> : <ChevronDown size={16} className="text-ava-text-dim" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {catFields.map(field => (
                        <div key={field.key}>
                          <label className="flex items-center gap-2 text-xs text-ava-text-dim mb-1.5 font-medium">
                            <span className="text-ava-cyan opacity-70">{field.icon}</span>
                            {field.label}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea
                              value={info[field.key]}
                              onChange={e => handleChange(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="cyber-input w-full px-3 py-2 rounded-lg text-sm resize-none"
                              rows={3}
                            />
                          ) : (
                            <input
                              type="text"
                              value={info[field.key]}
                              onChange={e => handleChange(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="cyber-input w-full px-3 py-2 rounded-lg text-sm"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
