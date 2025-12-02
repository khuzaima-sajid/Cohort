import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Trash2, Users, Settings, Cpu, Download, RefreshCw, Copy, AlertCircle, Check, Zap, Rocket } from 'lucide-react';

/**
 * TEAM NEBULA - ENHANCED AI GROUP BUILDER (Hyper-Modern Aesthetic)
 * ------------------------------------------------
 * Features custom Neon Slider, 3D card tilt, and deeper neon effects.
 */

// --- Design System Constants & Utilities ---

// Core Palette Hex Values + New Accents
const DS = {
  // Base Colors
  starfieldBlack: '#05050A',
  deepSpace: '#0A0F1F',
  glassWhite: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.12)',

  // Primary Neon (from original DS)
  nebulaBlue: '#00E5FF',
  hyperViolet: '#B04CFF',
  cosmicPink: '#FF47C8',

  // Secondary / Accent (enhanced)
  plasmaGreen: '#A8FF4F',
  neonMint: '#3DFFAD',
  laserRed: '#FF3860',

  // NEW Requested Colors mapped to Neon Aesthetic
  pictonBlue: '#33AFFF', // Brightened Picton Blue
  electricPurple: '#BF00FF', // Intense Electric Purple
  quantumGreen: '#4FFFD8', // Vibrant Seagreen equivalent
};

// Gradient CSS Class Definitions (Tailwind arbitrary values are used for flexibility)
const NEBULA_ROLES_COLORS = [
  { name: 'Lead', id: 'r1', color: 'cosmicPink', hex: DS.cosmicPink },
  { name: 'Co-Lead', id: 'r2', color: 'hyperViolet', hex: DS.hyperViolet },
  { name: 'Developer', id: 'r3', color: 'plasmaGreen', hex: DS.plasmaGreen },
  { name: 'Designer', id: 'r4', color: 'nebulaBlue', hex: DS.nebulaBlue },
  { name: 'Architect', id: 'r5', color: 'electricPurple', hex: DS.electricPurple }, // New color mapping
  { name: 'QA Analyst', id: 'r6', color: 'quantumGreen', hex: DS.quantumGreen }, // New color mapping
];

const AI_TEAM_NAMES = [
  'Nebula Core',
  'Quantum Stream',
  'Cosmic Flux',
  'Hyperdrive',
  'Starlight Fleet',
  'Ion Grid',
  'Aura Protocol',
  'Vector Group',
  'Deep Space Drifters',
  'Celestial Code',
];

const generateId = () => Math.random().toString(36).substr(2, 9);

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// --- Custom Styles for Design System (Injected via <style>) ---
const NebulaStyles = () => (
  <style>
    {`
      /* Root Background with Cyber Grid Effect */
      body {
        background-color: ${DS.starfieldBlack};
        /* Subtle Grid Pattern for Cyber Vibe */
        background-image: linear-gradient(0deg, ${DS.deepSpace} 1px, transparent 1px),
                          linear-gradient(90deg, ${DS.deepSpace} 1px, transparent 1px);
        background-size: 50px 50px;
        background-position: center center;
      }

      /* Base Card Glassmorphism and 3D Tilt Setup */
      .nebula-card {
        background-color: ${DS.glassWhite};
        backdrop-filter: blur(20px);
        border: 1px solid ${DS.glassBorder};
        border-radius: 1.5rem; /* global: 1.5rem */
        box-shadow: 0 0 15px ${DS.nebulaBlue}1A;
        transition: all 400ms cubic-bezier(0.22, 0.61, 0.36, 1);
        transform: perspective(1000px);
      }

      /* Card Hover Effect: Stronger Glow + 3D Tilt */
      .nebula-card:hover {
        transform: perspective(1000px) scale(1.01) rotateY(1deg) rotateX(0.5deg); /* 3D tilt + slight scale */
        box-shadow: 0 0 35px ${DS.hyperViolet}50, 0 0 15px ${DS.cosmicPink}30; /* Double color glow pulse */
      }

      /* Primary Gradient Button */
      .btn-primary-nebula {
        background: linear-gradient(90deg, ${DS.nebulaBlue}, ${DS.hyperViolet}, ${DS.cosmicPink}); /* nebulaCore */
        border: none;
        box-shadow: 0 4px 25px ${DS.hyperViolet}70;
        transition: all 400ms cubic-bezier(0.22, 0.61, 0.36, 1);
        border-radius: 1.5rem; /* Slightly larger radius for buttons */
      }
      .btn-primary-nebula:hover {
        transform: scale(1.03); /* Scale 1.03 */
        box-shadow: 0 0 40px ${DS.nebulaBlue}, 0 0 15px ${DS.cosmicPink}; /* Stronger glow pulse */
      }

      /* Glass Button */
      .btn-glass {
        background-color: ${DS.glassWhite};
        border: 1px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(10px);
        color: white;
        transition: all 250ms ease;
        border-radius: 1.5rem;
      }
      .btn-glass:hover {
        background-color: rgba(255,255,255,0.15);
        border-color: ${DS.nebulaBlue};
        box-shadow: 0 0 10px ${DS.nebulaBlue}50;
      }

      /* Neon Text Gradient (for H1/H2) */
      .neon-text-gradient {
        background: linear-gradient(90deg, ${DS.nebulaBlue}, ${DS.hyperViolet}, ${DS.cosmicPink});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        text-shadow: 0 0 8px rgba(0, 229, 255, 0.3);
      }

      /* Custom Scrollbar */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: ${DS.hyperViolet};
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background-color: ${DS.deepSpace};
      }

      /* --- Neon Slider Styling --- */

      /* Base track styles */
      .neon-slider-track {
        height: 10px;
        background: ${DS.deepSpace};
        border: 1px solid ${DS.pictonBlue}50;
        border-radius: 9999px;
        box-shadow: inset 0 0 5px ${DS.starfieldBlack};
      }

      /* Filled track (custom style) */
      .neon-slider-progress {
        background: linear-gradient(90deg, ${DS.pictonBlue}, ${DS.electricPurple});
        height: 10px;
        border-radius: 9999px;
      }

      /* Base input range styling (Webkit - Chrome/Safari) */
      input[type='range'] {
        -webkit-appearance: none;
        width: 100%;
        height: 10px;
        background: transparent;
      }

      input[type='range']::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        height: 10px;
        background: ${DS.deepSpace};
        border: 1px solid ${DS.pictonBlue}50;
        border-radius: 9999px;
        box-shadow: inset 0 0 5px ${DS.starfieldBlack};
      }

      input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 24px;
        width: 24px;
        margin-top: -8px; /* Center thumb on track */
        background: linear-gradient(135deg, ${DS.electricPurple}, ${DS.pictonBlue});
        border-radius: 50%;
        border: 2px solid ${DS.starfieldBlack};
        box-shadow: 0 0 15px ${DS.electricPurple}, 0 0 5px ${DS.pictonBlue};
        cursor: pointer;
        transition: box-shadow 0.2s, transform 0.2s;
      }

      input[type='range']::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 0 25px ${DS.electricPurple}, 0 0 10px ${DS.pictonBlue};
      }

      /* Base input range styling (Moz - Firefox) */
      input[type='range']::-moz-range-track {
        height: 10px;
        background: ${DS.deepSpace};
        border: 1px solid ${DS.pictonBlue}50;
        border-radius: 9999px;
        box-shadow: inset 0 0 5px ${DS.starfieldBlack};
      }

      input[type='range']::-moz-range-thumb {
        height: 24px;
        width: 24px;
        background: linear-gradient(135deg, ${DS.electricPurple}, ${DS.pictonBlue});
        border-radius: 50%;
        border: none;
        box-shadow: 0 0 15px ${DS.electricPurple}, 0 0 5px ${DS.pictonBlue};
        cursor: pointer;
      }
    `}
  </style>
);

// --- Components ---

const Card = ({ children, className = '' }) => (
  <div className={`nebula-card p-8 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', icon: Icon, disabled = false, className = "" }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 font-bold transition-all duration-400 transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap text-sm tracking-wide";
  let variantStyle = '';

  switch (variant) {
    case 'primary':
      variantStyle = 'btn-primary-nebula text-white';
      break;
    case 'glass':
      variantStyle = 'btn-glass';
      break;
    case 'danger':
      variantStyle = 'bg-laserRed/10 hover:bg-laserRed/20 text-laserRed border border-laserRed/40 rounded-[1.5rem]';
      break;
    default:
      variantStyle = 'btn-primary-nebula text-white';
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variantStyle} ${className}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Badge = ({ children, roleHex, className = '' }) => {
  
  return (
    <span 
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-opacity-20 border border-opacity-30`} 
      style={{ backgroundColor: roleHex + '30', color: roleHex, borderColor: roleHex + '80', boxShadow: `0 0 8px ${roleHex}40` }}
    >
      {children}
    </span>
  );
};

// Custom Neon Slider Component
const NeonSlider = ({ min, max, value, onChange }) => {
    // This component relies heavily on the custom CSS injected via NebulaStyles
    
    // Calculate the percentage fill for the track background style
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="relative h-10 flex items-center w-full">
            {/* Custom filled track (for visual progress) */}
            <div 
                className="absolute neon-slider-progress pointer-events-none"
                style={{ width: `${percentage}%` }}
            ></div>
            {/* The actual range input */}
            <input 
                type="range" 
                min={min} 
                max={max} 
                value={value} 
                onChange={onChange}
                className="w-full relative z-10" // The range input track is styled by ::-webkit-slider-runnable-track and ::-moz-range-track
            />
        </div>
    );
};

// --- Main Application ---

export default function App() {
  // --- State Initialization ---
  
  const [activeTab, setActiveTab] = useState('generate');
  
  const [roles, setRoles] = useState(NEBULA_ROLES_COLORS.map(r => ({ id: r.id, name: r.name, color: r.color })));

  const initialRoleId = roles.find(r => r.name === 'Developer')?.id || 'r3';
  const [members, setMembers] = useState([
    { id: 'm1', name: 'Zoe Nova', roleId: 'r1' },
    { id: 'm2', name: 'Kaelen Hyper', roleId: 'r2' },
    { id: 'm3', name: 'Jett Vector', roleId: initialRoleId },
    { id: 'm4', name: 'Lyra Pulsar', roleId: initialRoleId },
    { id: 'm5', name: 'Onyx Star', roleId: initialRoleId },
    { id: 'm6', name: 'Riven Flux', roleId: initialRoleId },
    { id: 'm7', name: 'Cyrus Data', roleId: initialRoleId },
    { id: 'm8', name: 'Anya Byte', roleId: initialRoleId },
    { id: 'm9', name: 'Jax Orbit', roleId: 'r4' },
    { id: 'm10', name: 'Syd Chaos', roleId: 'r4' },
  ]);

  const [templates, setTemplates] = useState([
    { 
      id: 't1', 
      name: 'Standard Squad Protocol', 
      structure: { 
        'r1': 1, // Lead
        'r3': 2, // Developer
        'r4': 1  // Designer
      } 
    },
    { 
      id: 't2', 
      name: 'Developer Core Team', 
      structure: { 
        'r1': 1, 
        'r3': 3, 
      } 
    }
  ]);

  const [selectedTemplateId, setSelectedTemplateId] = useState('t1');
  const [teamCount, setTeamCount] = useState(3);
  const [generatedGroups, setGeneratedGroups] = useState([]);
  const [generationLog, setGenerationLog] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState(roles[0]?.id || '');
  const [bulkInput, setBulkInput] = useState('');


  // --- Logic for Roles, Members, Templates (Unchanged logic from previous version) ---
  
  const getRoleHex = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    const colorTheme = NEBULA_ROLES_COLORS.find(c => c.color === role?.color);
    return colorTheme?.hex || DS.nebulaBlue;
  };

  const addRole = () => {
    const newRole = { id: generateId(), name: 'New Role', color: 'electricPurple' };
    setRoles([...roles, newRole]);
  };

  const removeRole = (id) => {
    const roleName = roles.find(r => r.id === id)?.name;
    if (!window.confirm(`Are you sure you want to delete the role "${roleName}"? All members assigned to this role will be set to the first available role.`)) return;
    
    setRoles(roles.filter(r => r.id !== id));
    const fallbackRole = roles.find(r => r.id !== id)?.id;
    setMembers(members.map(m => m.roleId === id ? { ...m, roleId: fallbackRole } : m));
    
    setTemplates(templates.map(t => {
      const { [id]: _, ...rest } = t.structure;
      return { ...t, structure: rest };
    }));
  };

  const updateRole = (id, field, value) => {
    setRoles(roles.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleAddMember = (name, roleId) => {
    if (!name.trim()) return;
    setMembers([...members, { id: generateId(), name: name.trim(), roleId }]);
    setNewMemberName('');
  };

  const handleBulkAddMembers = () => {
    const lines = bulkInput.split('\n').filter(l => l.trim());
    const newMembers = lines.map(line => {
      const parts = line.split(',').map(s => s.trim());
      const name = parts[0];
      const roleName = parts[1];
      
      let assignedRoleId = roles[0]?.id || ''; 
      
      if (roleName) {
        const foundRole = roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
        if (foundRole) assignedRoleId = foundRole.id;
      }
      
      return { id: generateId(), name: name || line, roleId: assignedRoleId };
    });
    setMembers([...members, ...newMembers]);
    setBulkInput('');
  };

  const clearMembers = () => {
    if (
      window.confirm(
        'Are you sure you want to clear the entire personnel database? This cannot be undone.',
      )
    ) {
      setMembers([]);
    }
  };

  const updateTemplate = (id, roleId, count) => {
    setTemplates(templates.map(t => {
      if (t.id !== id) return t;
      return { ...t, structure: { ...t.structure, [roleId]: Math.max(0, parseInt(count, 10) || 0) } };
    }));
  };

  const deleteTemplate = id => {
    if (!window.confirm('Delete this template?')) return;
    setTemplates(templates.filter(t => t.id !== id));
    if (selectedTemplateId === id) {
      setSelectedTemplateId(templates.find(t => t.id !== id)?.id || '');
    }
  };

  // --- The Generation Engine (Core Logic) ---

  const maxTeamCount = useMemo(() => {
    const template = templates.find(t => t.id === selectedTemplateId);
    const requiredTotalMembersPerTeam = Object.values(template?.structure || {}).reduce((a, b) => a + b, 0);
    if (requiredTotalMembersPerTeam === 0) return 1;
    return Math.max(1, Math.floor(members.length / requiredTotalMembersPerTeam));
  }, [selectedTemplateId, templates, members.length]);

  useEffect(() => {
    if (teamCount > maxTeamCount) {
      setTeamCount(maxTeamCount);
    }
  }, [maxTeamCount, teamCount]);

  const validateGeneration = useCallback(() => {
    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return { valid: false, message: 'No template selected.' };
    if (teamCount <= 0) return { valid: false, message: 'Team count must be greater than zero.' };

    const errors = [];
    let requiredTotalMembers = 0;

    Object.entries(template.structure).forEach(([roleId, countPerTeam]) => {
      const roleName = roles.find(r => r.id === roleId)?.name || 'Unknown Role';
      const required = countPerTeam * teamCount;
      const available = members.filter(m => m.roleId === roleId).length;
      requiredTotalMembers += required;

      if (countPerTeam > 0 && available < required) {
        errors.push(`Requires ${required} ${roleName}s, but only have ${available}.`);
      }
    });

    if (errors.length > 0) return { valid: false, message: errors.join(' ') };
    if (requiredTotalMembers === 0) return { valid: false, message: 'The selected template has no roles defined.' };

    return { valid: true };
  }, [selectedTemplateId, teamCount, templates, roles, members]);

  const generateTeams = () => {
    const validation = validateGeneration();
    if (!validation.valid) {
      setGenerationLog([`Generation failed: ${validation.message}`]);
      return;
    }

    setIsGenerating(true);
    setGenerationLog([]);
    const logs = [];

    setTimeout(() => {
      const template = templates.find((t) => t.id === selectedTemplateId);
      const groups = [];
      const usedMemberIds = new Set();
      const shuffledNames = shuffleArray(AI_TEAM_NAMES);

      const pools = {};
      roles.forEach(role => {
        pools[role.id] = shuffleArray(members.filter(m => m.roleId === role.id));
        logs.push(`Pool '${role.name}' initialized with ${pools[role.id].length} members.`);
      });

      for (let i = 0; i < teamCount; i += 1) {
        const groupMembers = [];
        const groupName = shuffledNames[i % shuffledNames.length] + ' ' + (Math.floor(Math.random() * 999) + 100);

        logs.push(`\n--- Allocating Group ${i + 1}: ${groupName} ---`);

        Object.entries(template.structure).forEach(([roleId, count]) => {
          const role = roles.find(r => r.id === roleId);
          const roleName = role?.name || 'Unknown';
          const roleHex = getRoleHex(roleId);

          for (let c = 0; c < count; c += 1) {
            if (pools[roleId].length > 0) {
              const member = pools[roleId].pop();
              groupMembers.push({ ...member, roleName, roleHex });
              usedMemberIds.add(member.id);
              logs.push(`  - Assigned ${member.name} as ${roleName}`);
            } else {
              logs.push(`  - WARNING: Insufficient ${roleName}s for slot ${c + 1}/${count} in this group.`);
            }
          }
        });

        groups.push({ id: generateId(), name: groupName, members: groupMembers, colorIdx: i, templateName: template.name });
      }

      const leftoverMembers = members.filter(m => !usedMemberIds.has(m.id));
      if (leftoverMembers.length > 0) {
        logs.push(`\n${leftoverMembers.length} members were unassigned (Leftover Pool).`);
        leftoverMembers.forEach(m => logs.push(`  - Unassigned: ${m.name} (${roles.find(r => r.id === m.roleId)?.name})`));
      } else {
        logs.push('\nAll members successfully assigned or used in the template calculations.');
      }

      setGeneratedGroups(groups);
      setGenerationLog(logs);
      setIsGenerating(false);
      setActiveTab('results');
    }, 500);
  };

  const exportCSV = () => {
    let csv = 'Group Name,Member Name,Role,Template\n';
    generatedGroups.forEach(g => {
      g.members.forEach(m => {
        csv += `${g.name},"${m.name}","${m.roleName}","${g.templateName}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TeamNebula_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // --- Views ---

  const renderRolesTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold neon-text-gradient tracking-wide">
            Role Protocols
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Define the hierarchy and classifications for resource allocation.
          </p>
        </div>
        <Button onClick={addRole} variant="glass" icon={Plus}>
          Add New Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => {
          const roleHex = getRoleHex(role.id);

          return (
            <Card key={role.id} className="relative group p-6" style={{ borderLeft: `4px solid ${roleHex}` }}>
              <div className="flex flex-col space-y-3">
                <div className="flex-grow space-y-1">
                  <label htmlFor={`role-name-${role.id}`} className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                    Role Name
                  </label>
                  <input
                    id={`role-name-${role.id}`}
                    value={role.name}
                    onChange={e => updateRole(role.id, 'name', e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 w-full focus:border-nebulaBlue outline-none transition-colors font-medium"
                    style={{ borderColor: `${roleHex}30`, boxShadow: `0 0 5px ${roleHex}1A` }}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor={`role-color-${role.id}`} className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                    Color Tag
                  </label>
                  <select
                    id={`role-color-${role.id}`}
                    value={role.color}
                    onChange={e => updateRole(role.id, 'color', e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 w-full focus:border-nebulaBlue outline-none appearance-none font-medium"
                  >
                    {NEBULA_ROLES_COLORS.map(c => (
                      <option key={c.color} value={c.color}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <Badge roleHex={roleHex}>{members.filter(m => m.roleId === role.id).length} Active Personnel</Badge>

                <button
                  type="button"
                  onClick={() => removeRole(role.id)}
                  className="p-1 text-slate-500 hover:text-laserRed hover:bg-laserRed/10 rounded-full transition-colors"
                  title="Delete Role"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold neon-text-gradient tracking-wide">
            Personnel Database
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage roster and assign classifications before generation.
          </p>
        </div>
        <Button onClick={clearMembers} variant="danger" icon={Trash2}>
          Clear All Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add/Bulk Input */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Plus size={20} className="text-plasmaGreen" /> Add Single Member
            </h3>

            <label
              htmlFor="memberName"
              className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1"
            >
              Name
            </label>
            <input
              id="memberName"
              type="text"
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddMember(newMemberName, newMemberRole)}
              placeholder="E.g., Kepler Flux"
              className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 w-full focus:border-nebulaBlue outline-none mb-3"
            />

            <label htmlFor="memberRole" className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
              Role Classification
            </label>
            <select
              id="memberRole"
              value={newMemberRole}
              onChange={e => setNewMemberRole(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 w-full focus:border-nebulaBlue outline-none appearance-none mb-4 font-medium"
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <Button
              onClick={() => handleAddMember(newMemberName, newMemberRole)}
              variant="primary"
              className="w-full"
              icon={Plus}
              disabled={!newMemberName.trim()}
            >
              Enroll Personnel
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <Copy size={20} className="text-hyperViolet" /> Bulk Upload
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste data below. Format: <code>Name, RoleName (optional)</code>
            </p>
            <textarea
              value={bulkInput}
              onChange={e => setBulkInput(e.target.value)}
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-300 focus:border-nebulaBlue outline-none resize-none font-mono"
              placeholder="E.g.:&#10;Marie, Lead&#10;Ada Lovelace"
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleBulkAddMembers}
                variant="glass"
                disabled={!bulkInput.trim()}
              >
                Process Data Stream
              </Button>
            </div>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="nebula-card p-0 flex flex-col max-h-[700px]">
            <div className="p-4 border-b border-white/10 bg-white/10 flex justify-between items-center rounded-t-[1.5rem]">
              <span className="text-base font-semibold text-white">
                Total Active Personnel:{' '}
                <span className="text-nebulaBlue">{members.length}</span>
              </span>
              <span className="text-xs text-slate-500">Assignment Interface</span>
            </div>
            <div className="overflow-y-auto custom-scrollbar p-6 space-y-3 flex-grow">
              {members.length === 0 && (
                <div className="text-center py-10 text-slate-500 italic">
                  No personnel records found.
                </div>
              )}
              {members.map(member => {
                const role = roles.find(r => r.id === member.roleId);
                const roleHex = getRoleHex(member.roleId);

                return (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                    <span className="font-medium text-slate-200 truncate pr-2">{member.name}</span>
                    <div className="flex items-center gap-3">
                      <select
                        value={member.roleId}
                        onChange={e => setMembers(members.map(m => m.id === member.id ? { ...m, roleId: e.target.value } : m))}
                        className="bg-white/10 text-xs text-slate-400 border border-white/10 rounded-xl px-2 py-1 outline-none focus:border-nebulaBlue font-medium"
                      >
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                      {role && <Badge roleHex={roleHex}>{role.name}</Badge>}
                      <button
                        type="button"
                        onClick={() => setMembers(members.filter(m => m.id !== member.id))}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-laserRed transition-opacity p-1"
                        title="Remove Personnel"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h2 className="text-3xl font-bold neon-text-gradient tracking-wide">
          Structural Templates
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Define the perfect team composition for automated group generation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Template List (Left) */}
        <div className="col-span-1 space-y-4">
          {templates.map((t) => {
            const teamSize = Object.values(t.structure).reduce(
              (a, b) => a + b,
              0,
            );
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTemplateId(t.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all relative group ${
                  selectedTemplateId === t.id
                    ? 'bg-hyperViolet/20 border-hyperViolet/80 shadow-[0_0_20px_rgba(176,76,255,0.4)]'
                    : 'bg-white/5 border-white/10 hover:border-hyperViolet/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-white text-lg">{t.name}</span>
                  <div className="flex gap-2">
                    <Badge roleHex={DS.nebulaBlue}>{teamSize} Slots</Badge>
                    {selectedTemplateId === t.id && (
                      <Check size={18} className="text-nebulaBlue" />
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mt-2">
                  {Object.entries(t.structure).filter(([, count]) => count > 0).map(([rid, count]) => {
                    const rName = roles.find(r => r.id === rid)?.name;
                    if (!rName) return null;
                    return (
                      <div key={rid} className="flex justify-between">
                        <span>{rName}</span>
                        <span className="font-mono text-white/80">x{count}</span>
                      </div>
                    );
                  })}
                </div>
                {t.id !== 't1' && (
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); deleteTemplate(t.id); }}
                    className="absolute top-2 right-2 p-1 text-slate-500 hover:text-laserRed opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Template"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
          <Button
            variant="glass"
            className="w-full mt-4"
            onClick={() => setTemplates([...templates, { id: generateId(), name: 'New Custom Matrix', structure: {} }])}
            icon={Plus}
          >
            Create New Template
          </Button>
        </div>

        {/* Editor (Right) */}
        <div className="col-span-2">
          {selectedTemplateId ? (
            <Card className="p-8">
              <div className="mb-6">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-2">
                  Template Matrix Name
                </label>
                <input
                  value={templates.find(t => t.id === selectedTemplateId)?.name || ''}
                  onChange={e => setTemplates(templates.map(t => t.id === selectedTemplateId ? { ...t, name: e.target.value } : t))}
                  className="bg-white/5 border border-white/10 text-white text-xl font-bold rounded-xl px-4 py-3 w-full focus:border-nebulaBlue outline-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm uppercase tracking-wider text-nebulaBlue font-extrabold block">
                  Composition Rules (Units Per Group)
                </label>
                {roles.map(role => {
                  const template = templates.find(t => t.id === selectedTemplateId);
                  const currentCount = template?.structure[role.id] || 0;
                  const roleHex = getRoleHex(role.id);

                  return (
                    <div key={role.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: roleHex }} />
                        <span className="text-slate-200 font-medium">{role.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateTemplate(selectedTemplateId, role.id, currentCount - 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-30 border border-white/10"
                          disabled={currentCount === 0}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono text-xl font-bold" style={{ color: roleHex, textShadow: `0 0 5px ${roleHex}60` }}>
                          {currentCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateTemplate(selectedTemplateId, role.id, currentCount + 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <p className="text-slate-500 italic">
                Select or create a template to configure its composition matrix.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  const renderGenerateTab = () => {
    const validation = validateGeneration();
    const currentTemplate = templates.find((t) => t.id === selectedTemplateId);

    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-3">
          <h2 className="text-5xl font-extrabold neon-text-gradient tracking-widest">
            Execute Generation Protocol
          </h2>
          <p className="text-slate-400 text-lg">
            Initiate the AI-driven random allocation sequence.
          </p>
        </div>

        <Card className="p-10 border-t-4 border-t-nebulaBlue">
          <div className="space-y-8">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-hyperViolet uppercase tracking-wider mb-2">
                  Active Template
                </label>
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 text-white flex items-center gap-3 font-semibold text-lg">
                  <Cpu size={20} className="text-nebulaBlue" />
                  {currentTemplate?.name || 'No Protocol Loaded'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-hyperViolet uppercase tracking-wider mb-2">
                  Team Count
                </label>
                <div className="flex flex-col gap-2">
                  {/* CUSTOM NEON SLIDER */}
                  <NeonSlider
                    min={1}
                    max={maxTeamCount}
                    value={teamCount}
                    onChange={(e) =>
                      setTeamCount(parseInt(e.target.value, 10) || 1)
                    }
                  />

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-base text-slate-400">1 Squad</span>
                    <span
                      className="text-4xl font-extrabold font-mono"
                      style={{
                        color: DS.pictonBlue,
                        textShadow: `0 0 15px ${DS.pictonBlue}A0`,
                      }}
                    >
                      {teamCount}
                    </span>
                    <span className="text-base text-slate-400">
                      Max ({maxTeamCount})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Feedback */}
            <div className={`p-4 rounded-xl flex items-start gap-3 border ${validation.valid ? 'bg-plasmaGreen/10 text-plasmaGreen border-plasmaGreen/40' : 'bg-laserRed/10 text-laserRed border-laserRed/40'}`}>
              {validation.valid ? <Check className="mt-1" size={20} /> : <AlertCircle className="mt-1" size={20} />}
              <div>
                <p className="font-extrabold text-lg">{validation.valid ? 'System Status: Nominal' : 'System Status: Resource Alert'}</p>
                {!validation.valid && <p className="text-sm opacity-90 mt-1">{validation.message || 'Review roles, members, and template to proceed.'}</p>}
                {validation.valid && <p className="text-sm opacity-90 mt-1">AI is ready to deploy {members.length} personnel into {teamCount} balanced squads.</p>}
              </div>
            </div>

            <Button
              onClick={generateTeams}
              disabled={!validation.valid || isGenerating}
              variant="primary"
              className="w-full py-4 text-xl tracking-wider"
            >
              {isGenerating ? (
                <span className="flex items-center gap-3 animate-pulse">
                  <RefreshCw className="animate-spin" size={20} /> Processing Cosmic Allocation...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Zap size={22} /> Initiate Quantum Randomization
                </span>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderResultsTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold neon-text-gradient tracking-wide">
            Allocation Results
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {generatedGroups.length} balanced squads generated from "{generatedGroups[0]?.templateName || 'Custom'}" protocol.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="glass" onClick={() => setActiveTab('generate')} icon={RefreshCw}>
            Reshuffle Matrix
          </Button>
          <Button variant="primary" onClick={exportCSV} icon={Download}>
            Export Data Stream
          </Button>
        </div>
      </div>

      {/* Generation Log / Audit */}
      <Card className="p-4 bg-white/5 border-white/10">
        <h3 className="text-sm font-extrabold text-nebulaBlue mb-2">
          Audit Log / AI Trace
        </h3>
        <div className="max-h-32 overflow-y-auto custom-scrollbar text-xs text-slate-500 font-mono space-y-0.5">
          {generationLog.map((log, index) => (
            <p key={index} className={log.includes('WARNING') ? 'text-laserRed' : ''}>{log}</p>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {generatedGroups.map((group, idx) => {
          const gradient = `linear-gradient(90deg, ${DS.pictonBlue}, ${DS.electricPurple})`;

          return (
            <div key={group.id} className="relative overflow-hidden nebula-card p-0 transition-transform hover:-translate-y-1 hover:shadow-2xl" style={{ boxShadow: `0 0 30px ${DS.hyperViolet}30` }}>
              {/* Header Bar - Gradient */}
              <div className="h-2 w-full" style={{ background: gradient }} />

              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-wide text-white">{group.name}</h3>
                    <p className="text-xs text-hyperViolet uppercase tracking-widest mt-1 font-bold">Squadron {String(idx + 1).padStart(2, '0')}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-nebulaBlue/50" style={{ color: DS.nebulaBlue }}>
                    <Users size={16} />
                  </div>
                </div>

                <div className="space-y-3">
                  {group.members.map((member) => {
                    const roleHex = member.roleHex || DS.nebulaBlue;
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                      >
                        <span className="text-slate-200 text-sm truncate font-medium">
                          {member.name}
                        </span>
                        <Badge roleHex={roleHex}>{member.roleName}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {members.filter(
          (m) =>
            !generatedGroups
              .flatMap((g) => g.members)
              .map((gm) => gm.id)
              .includes(m.id),
        ).length > 0 && (
          <Card className="sm:col-span-2 xl:col-span-3">
            <h3 className="text-xl font-bold text-laserRed mb-4 flex items-center gap-2">
              <AlertCircle size={20} /> Unassigned Personnel (Leftover Pool)
            </h3>
            <div className="flex flex-wrap gap-3">
              {members
                .filter(
                  (m) =>
                    !generatedGroups
                      .flatMap((g) => g.members)
                      .map((gm) => gm.id)
                      .includes(m.id),
                )
                .map((member) => {
                  const role = roles.find((r) => r.id === member.roleId);
                  const roleHex = getRoleHex(member.roleId);
                  return (
                    <Badge key={member.id} roleHex={roleHex}>
                      {member.name} ({role?.name})
                    </Badge>
                  );
                })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  // --- Render Navigation & Layout ---

  return (
    <div className="min-h-screen text-white font-sans selection:bg-hyperViolet/50" style={{ backgroundColor: DS.starfieldBlack }}>
      {/* Inject Custom Styles */}
      <NebulaStyles />

      {/* Background Ambience - Floating Particles/Nebula Drift */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-nebulaBlue/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-cosmicPink/10 rounded-full blur-[150px] animate-pulse animation-delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-nebulaBlue to-hyperViolet flex items-center justify-center shadow-lg" style={{ boxShadow: `0 0 20px ${DS.nebulaBlue}60` }}>
              <Rocket className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Team<span className="neon-text-gradient">Nebula</span></h1>
              <p className="text-xs text-hyperViolet uppercase tracking-widest mt-1 font-bold">Empowerment Through Learning</p>
            </div>
          </div>

          {/* Nav Tabs - Glassmorphism Navbar */}
          <nav className="flex p-2 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-x-auto shadow-lg shadow-black/30">
            {[
              { id: 'roles', label: 'Roles', icon: Settings },
              { id: 'members', label: 'Personnel', icon: Users },
              { id: 'templates', label: 'Templates', icon: Copy },
              { id: 'generate', label: 'Generate', icon: Cpu },
              { id: 'results', label: 'Results', icon: Check, disabled: generatedGroups.length === 0 },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-hyperViolet text-white shadow-xl shadow-hyperViolet/30' : 'text-slate-300 hover:text-nebulaBlue hover:bg-white/10'} ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[600px] pb-12">
          {activeTab === 'roles' && renderRolesTab()}
          {activeTab === 'members' && renderMembersTab()}
          {activeTab === 'templates' && renderTemplatesTab()}
          {activeTab === 'generate' && renderGenerateTab()}
          {activeTab === 'results' && renderResultsTab()}
        </main>
      </div>
    </div>
  );
}
