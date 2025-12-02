import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Trash2, Users, Settings, Cpu, Download, RefreshCw, Copy, AlertCircle, Check, Zap, Rocket } from 'lucide-react';

/**
 * TEAM COHORT - ENHANCED GROUP BUILDER (Hyper-Modern Aesthetic)
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
  cohortBlue: '#00E5FF',
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
const COHORT_ROLES_COLORS = [
  { name: 'Lead', id: 'r1', color: 'cosmicPink', hex: DS.cosmicPink },
  { name: 'Co-Lead', id: 'r2', color: 'hyperViolet', hex: DS.hyperViolet },
  { name: 'Developer', id: 'r3', color: 'plasmaGreen', hex: DS.plasmaGreen },
  { name: 'Designer', id: 'r4', color: 'cohortBlue', hex: DS.cohortBlue },
  { name: 'Architect', id: 'r5', color: 'electricPurple', hex: DS.electricPurple }, // New color mapping
  { name: 'QA Analyst', id: 'r6', color: 'quantumGreen', hex: DS.quantumGreen }, // New color mapping
];

const TEAM_NAMES = [
  "Cohort Core", "Stream Team", "Cosmic Flux", "Hyperdrive", "Starlight Fleet", 
  "Ion Grid", "Aura Protocol", "Vector Group", "Deep Space Drifters", "Celestial Code",
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
const CohortStyles = () => (
  <style>
    {`
      /* Root Background with Cyber Grid Effect */
      * {
        -webkit-tap-highlight-color: transparent;
      }
      
      html {
        scroll-behavior: smooth;
      }
      
      body {
        background-color: ${DS.starfieldBlack};
        /* Subtle Grid Pattern for Cyber Vibe */
        background-image: linear-gradient(0deg, ${DS.deepSpace} 1px, transparent 1px), 
                          linear-gradient(90deg, ${DS.deepSpace} 1px, transparent 1px);
        background-size: 50px 50px;
        background-position: center center;
      }
      
      /* Base Card Glassmorphism and 3D Tilt Setup */
      .cohort-card {
        background-color: ${DS.glassWhite};
        backdrop-filter: blur(20px);
        border: 1px solid ${DS.glassBorder};
        border-radius: 1.5rem; /* global: 1.5rem */
        box-shadow: 0 0 15px ${DS.cohortBlue}1A; 
        transition: all 400ms cubic-bezier(0.22, 0.61, 0.36, 1);
        transform: perspective(1000px);
      }

      /* Card Hover Effect: Stronger Glow + 3D Tilt */
      .cohort-card:hover {
        transform: perspective(1000px) scale(1.01) rotateY(1deg) rotateX(0.5deg); /* 3D tilt + slight scale */
        box-shadow: 0 0 35px ${DS.hyperViolet}50, 0 0 15px ${DS.cosmicPink}30; /* Double color glow pulse */
      }

      /* Primary Gradient Button */
      .btn-primary-cohort {
        background: linear-gradient(90deg, ${DS.cohortBlue}, ${DS.hyperViolet}, ${DS.cosmicPink}); /* cohortCore */
        border: none;
        box-shadow: 0 4px 25px ${DS.hyperViolet}70;
        transition: all 400ms cubic-bezier(0.22, 0.61, 0.36, 1);
        border-radius: 1.5rem; /* Slightly larger radius for buttons */
      }
      .btn-primary-cohort:hover {
        transform: scale(1.03); /* Scale 1.03 */
        box-shadow: 0 0 40px ${DS.cohortBlue}, 0 0 15px ${DS.cosmicPink}; /* Stronger glow pulse */
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
        border-color: ${DS.cohortBlue};
        box-shadow: 0 0 10px ${DS.cohortBlue}50;
      }
      
      /* Neon Text Gradient (for H1/H2) */
      .neon-text-gradient {
        background: linear-gradient(90deg, ${DS.cohortBlue}, ${DS.hyperViolet}, ${DS.cosmicPink});
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
      
      /* Animation Delays */
      .animation-delay-1000 {
        animation-delay: 1000ms;
      }
      .animation-delay-2000 {
        animation-delay: 2000ms;
      }
      .delay-200 {
        animation-delay: 200ms;
      }
      .delay-400 {
        animation-delay: 400ms;
      }
      .delay-600 {
        animation-delay: 600ms;
      }
      .delay-800 {
        animation-delay: 800ms;
      }
      
      /* Page Transition Animation */
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      .page-transition {
        animation: fadeIn 0.5s ease-in-out;
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
      input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        height: 10px;
        background: transparent;
      }
      
      input[type="range"]::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        height: 10px;
        background: ${DS.deepSpace}; 
        border: 1px solid ${DS.pictonBlue}50;
        border-radius: 9999px;
        box-shadow: inset 0 0 5px ${DS.starfieldBlack};
      }

      input[type="range"]::-webkit-slider-thumb {
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
      
      input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 0 25px ${DS.electricPurple}, 0 0 10px ${DS.pictonBlue};
      }

      /* Base input range styling (Moz - Firefox) */
      input[type="range"]::-moz-range-track {
        height: 10px;
        background: ${DS.deepSpace}; 
        border: 1px solid ${DS.pictonBlue}50;
        border-radius: 9999px;
        box-shadow: inset 0 0 5px ${DS.starfieldBlack};
      }

      input[type="range"]::-moz-range-thumb {
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

const Card = ({ children, className = "" }) => (
  <div className={`cohort-card p-8 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', icon: Icon, disabled = false, className = "" }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 font-bold transition-all duration-400 transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap text-sm tracking-wide";
  let variantStyle = '';

  switch (variant) {
    case 'primary':
      variantStyle = 'btn-primary-cohort text-white';
      break;
    case 'glass':
      variantStyle = 'btn-glass';
      break;
    case 'danger':
      variantStyle = 'bg-laserRed/10 hover:bg-laserRed/20 text-laserRed border border-laserRed/40 rounded-[1.5rem]';
      break;
    default:
      variantStyle = 'btn-primary-cohort text-white';
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
    // This component relies heavily on the custom CSS injected via CohortStyles
    
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
  
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('generate');
  
  const [roles, setRoles] = useState(COHORT_ROLES_COLORS.map(r => ({ id: r.id, name: r.name, color: r.color })));
  
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
    const colorTheme = COHORT_ROLES_COLORS.find(c => c.color === role?.color);
    return colorTheme?.hex || DS.cohortBlue;
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
    if (window.confirm("Are you sure you want to clear the entire personnel database? This cannot be undone.")) {
      setMembers([]);
    }
  };
  
  const updateTemplate = (id, roleId, count) => {
    setTemplates(templates.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        structure: { ...t.structure, [roleId]: Math.max(0, parseInt(count) || 0) }
      };
    }));
  };
  
  const deleteTemplate = (id) => {
    if (!window.confirm("Delete this template?")) return;
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
    // Ensure teamCount doesn't exceed the new maxTeamCount when template/members change
    if (teamCount > maxTeamCount) {
      setTeamCount(maxTeamCount);
    }
  }, [maxTeamCount]);


  const validateGeneration = useCallback(() => {
    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return { valid: false, message: "No template selected." };
    if (teamCount <= 0) return { valid: false, message: "Team count must be greater than zero." };

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
    
    if (errors.length > 0) return { valid: false, message: errors.join(" ") };
    if (requiredTotalMembers === 0) return { valid: false, message: "The selected template has no roles defined." };

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
      const template = templates.find(t => t.id === selectedTemplateId);
      const groups = [];
      const usedMemberIds = new Set();
      const shuffledNames = shuffleArray(TEAM_NAMES);

      const pools = {};
      roles.forEach(role => {
        pools[role.id] = shuffleArray(members.filter(m => m.roleId === role.id));
        logs.push(`Pool '${role.name}' initialized with ${pools[role.id].length} members.`);
      });

      for (let i = 0; i < teamCount; i++) {
        const groupMembers = [];
        const groupName = shuffledNames[i % shuffledNames.length] + ' ' + (Math.floor(Math.random() * 999) + 100);
        
        logs.push(`\n--- Allocating Group ${i + 1}: ${groupName} ---`);

        Object.entries(template.structure).forEach(([roleId, count]) => {
          const role = roles.find(r => r.id === roleId);
          const roleName = role?.name || 'Unknown';
          const roleHex = getRoleHex(roleId);

          for (let c = 0; c < count; c++) {
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

        groups.push({
          id: generateId(),
          name: groupName,
          members: groupMembers,
          colorIdx: i,
          templateName: template.name
        });
      }

      const leftoverMembers = members.filter(m => !usedMemberIds.has(m.id));
      if (leftoverMembers.length > 0) {
        logs.push(`\n${leftoverMembers.length} members were unassigned (Leftover Pool).`);
        leftoverMembers.forEach(m => logs.push(`  - Unassigned: ${m.name} (${roles.find(r => r.id === m.roleId)?.name})`));
      } else {
        logs.push("\nAll members successfully assigned or used in the template calculations.");
      }

      setGeneratedGroups(groups);
      setGenerationLog(logs);
      setIsGenerating(false);
      setActiveTab('results');
    }, 500);
  };

  const exportCSV = () => {
    let csv = "Group Name,Member Name,Role,Template\n";
    generatedGroups.forEach(g => {
      g.members.forEach(m => {
        csv += `${g.name},"${m.name}","${m.roleName}","${g.templateName}"\n`;
      });
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cohort_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // --- Views ---
  
  const renderRolesTab = () => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 md:mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold neon-text-gradient tracking-wide">Role Protocols</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Define the hierarchy and classifications for resource allocation.</p>
        </div>
        <Button onClick={addRole} variant="glass" icon={Plus} className="w-full sm:w-auto">
          <span className="hidden sm:inline">Add New Class</span>
          <span className="sm:hidden">Add Role</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {roles.map(role => {
          const roleHex = getRoleHex(role.id);
          
          return (
            <Card key={role.id} className="relative group p-4 md:p-6" style={{ borderLeft: `4px solid ${roleHex}` }}>
              <div className="flex flex-col space-y-3">
                <div className="flex-grow space-y-1">
                  <label htmlFor={`role-name-${role.id}`} className="text-xs uppercase tracking-wider text-slate-500 font-bold">Role Name</label>
                  <input 
                    id={`role-name-${role.id}`}
                    value={role.name}
                    onChange={(e) => updateRole(role.id, 'name', e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 w-full focus:border-cohortBlue outline-none transition-colors font-medium text-sm md:text-base"
                    style={{ borderColor: roleHex + '30', boxShadow: `0 0 5px ${roleHex}1A` }}
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor={`role-color-${role.id}`} className="text-xs uppercase tracking-wider text-slate-500 font-bold">Color Tag</label>
                  <select 
                    id={`role-color-${role.id}`}
                    value={role.color}
                    onChange={(e) => updateRole(role.id, 'color', e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 w-full focus:border-cohortBlue outline-none appearance-none font-medium text-sm md:text-base"
                  >
                    {COHORT_ROLES_COLORS.map(c => <option key={c.color} value={c.color}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <Badge roleHex={roleHex}>
                  <span className="text-xs">{members.filter(m => m.roleId === role.id).length} Personnel</span>
                </Badge>
                
                <button 
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
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 md:mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold neon-text-gradient tracking-wide">Personnel Database</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Manage roster and assign classifications before generation.</p>
        </div>
        <Button onClick={clearMembers} variant="danger" icon={Trash2} className="w-full sm:w-auto">
          <span className="hidden sm:inline">Clear All Data</span>
          <span className="sm:hidden">Clear All</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Add/Bulk Input */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Plus size={20} className="text-plasmaGreen"/> Add Single Member
            </h3>
            
            <label htmlFor="memberName" className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">Name</label>
            <input 
              id="memberName"
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMember(newMemberName, newMemberRole)}
              placeholder="E.g., Kepler Flux"
              className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 w-full focus:border-cohortBlue outline-none mb-3"
            />
            
            <label htmlFor="memberRole" className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">Role Classification</label>
            <select 
              id="memberRole"
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 w-full focus:border-cohortBlue outline-none appearance-none mb-4 font-medium"
            >
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            
            <Button onClick={() => handleAddMember(newMemberName, newMemberRole)} variant="primary" className="w-full" icon={Plus} disabled={!newMemberName.trim()}>
              Enroll Personnel
            </Button>
          </Card>
          
          <Card className="p-6">
             <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <Copy size={20} className="text-hyperViolet"/> Bulk Upload
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste data below. Format: <code>Name, RoleName (optional)</code>
            </p>
            <textarea 
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-300 focus:border-cohortBlue outline-none resize-none font-mono"
              placeholder="E.g.:&#10;Marie, Lead&#10;Ada Lovelace"
            ></textarea>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleBulkAddMembers} variant="glass" disabled={!bulkInput.trim()}>
                Process Data Stream
              </Button>
            </div>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
           <div className="cohort-card p-0 flex flex-col max-h-[500px] md:max-h-[700px]">
             <div className="p-3 md:p-4 border-b border-white/10 bg-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 rounded-t-[1.5rem]">
               <span className="text-sm md:text-base font-semibold text-white">Total Active Personnel: <span className="text-cohortBlue">{members.length}</span></span>
               <span className="text-xs text-slate-500">Assignment Interface</span>
             </div>
             <div className="overflow-y-auto custom-scrollbar p-3 md:p-6 space-y-2 md:space-y-3 flex-grow">
               {members.length === 0 && (
                 <div className="text-center py-10 text-slate-500 italic text-sm">No personnel records found.</div>
               )}
               {members.map(member => {
                 const role = roles.find(r => r.id === member.roleId);
                 const roleHex = getRoleHex(member.roleId);

                 return (
                   <div key={member.id} className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group gap-2">
                     <span className="font-medium text-slate-200 truncate pr-2 text-sm md:text-base flex-shrink min-w-0">{member.name}</span>
                     <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
                       <select 
                         value={member.roleId}
                         onChange={(e) => setMembers(members.map(m => m.id === member.id ? {...m, roleId: e.target.value} : m))}
                         className="bg-white/10 text-xs text-slate-400 border border-white/10 rounded-xl px-1.5 md:px-2 py-1 outline-none focus:border-cohortBlue font-medium max-w-[100px] md:max-w-none"
                       >
                         {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                       </select>
                       {role && <Badge roleHex={roleHex} className="hidden sm:inline-flex">{role.name}</Badge>}
                       <button 
                         onClick={() => setMembers(members.filter(m => m.id !== member.id))}
                         className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-slate-500 hover:text-laserRed transition-opacity p-1"
                         title="Remove Personnel"
                       >
                         <Trash2 size={14} className="md:w-4 md:h-4" />
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
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 md:mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold neon-text-gradient tracking-wide">Structural Templates</h2>
        <p className="text-slate-400 text-xs md:text-sm mt-1">Define the perfect team composition for automated group generation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Template List (Left) */}
        <div className="lg:col-span-1 space-y-3 md:space-y-4">
          {templates.map(t => {
             const teamSize = Object.values(t.structure).reduce((a, b) => a + b, 0);
             return (
              <div 
                key={t.id}
                onClick={() => setSelectedTemplateId(t.id)}
                className={`p-4 md:p-5 rounded-2xl border cursor-pointer transition-all relative group ${
                  selectedTemplateId === t.id 
                    ? 'bg-hyperViolet/20 border-hyperViolet/80 shadow-[0_0_20px_rgba(176,76,255,0.4)]' 
                    : 'bg-white/5 border-white/10 hover:border-hyperViolet/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span className="font-bold text-white text-base md:text-lg flex-1 min-w-0 truncate">{t.name}</span>
                  <div className="flex gap-2 flex-shrink-0">
                    <Badge roleHex={DS.cohortBlue} className="text-xs">{teamSize} Slots</Badge>
                    {selectedTemplateId === t.id && <Check size={16} className="text-cohortBlue md:w-[18px] md:h-[18px]"/>}
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mt-2">
                  {Object.entries(t.structure).filter(([, count]) => count > 0).map(([rid, count]) => {
                    const rName = roles.find(r => r.id === rid)?.name;
                    if (!rName) return null;
                    return <div key={rid} className="flex justify-between"><span>{rName}</span> <span className="font-mono text-white/80">x{count}</span></div>;
                  })}
                </div>
                {t.id !== 't1' && ( 
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteTemplate(t.id); }}
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
        <div className="lg:col-span-2">
          {selectedTemplateId ? (
            <Card className="p-6 md:p-8">
              <div className="mb-6">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-2">Template Matrix Name</label>
                <input 
                  value={templates.find(t => t.id === selectedTemplateId)?.name || ''}
                  onChange={(e) => setTemplates(templates.map(t => t.id === selectedTemplateId ? {...t, name: e.target.value} : t))}
                  className="bg-white/5 border border-white/10 text-white text-lg md:text-xl font-bold rounded-xl px-3 md:px-4 py-2 md:py-3 w-full focus:border-cohortBlue outline-none"
                />
              </div>

              <div className="space-y-3 md:space-y-4">
                <label className="text-xs md:text-sm uppercase tracking-wider text-cohortBlue font-extrabold block">Composition Rules (Units Per Group)</label>
                {roles.map(role => {
                  const template = templates.find(t => t.id === selectedTemplateId);
                  const currentCount = template?.structure[role.id] || 0;
                  const roleHex = getRoleHex(role.id);
                  
                  return (
                    <div key={role.id} className="flex items-center justify-between p-2 md:p-3 bg-white/5 rounded-xl border border-white/10 gap-2">
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] flex-shrink-0`} style={{ backgroundColor: roleHex }}></div>
                        <span className="text-slate-200 font-medium text-sm md:text-base truncate">{role.name}</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                        <button 
                          onClick={() => updateTemplate(selectedTemplateId, role.id, currentCount - 1)}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-30 border border-white/10 text-sm md:text-base"
                          disabled={currentCount === 0}
                        >
                          -
                        </button>
                        <span className="w-7 md:w-8 text-center font-mono text-lg md:text-xl font-bold" style={{ color: roleHex, textShadow: `0 0 5px ${roleHex}60` }}>{currentCount}</span>
                        <button 
                          onClick={() => updateTemplate(selectedTemplateId, role.id, currentCount + 1)}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10 text-sm md:text-base"
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
            <Card className="h-full flex items-center justify-center p-8">
              <p className="text-slate-500 italic text-sm md:text-base text-center">Select or create a template to configure its composition matrix.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  const renderGenerateTab = () => {
    const validation = validateGeneration();
    const currentTemplate = templates.find(t => t.id === selectedTemplateId);
    
    return (
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2 md:space-y-3">
          <h2 className="text-3xl md:text-5xl font-extrabold neon-text-gradient tracking-widest">
            Execute Generation Protocol
          </h2>
          <p className="text-slate-400 text-base md:text-lg px-4">
            Initiate the random allocation sequence.
          </p>
        </div>

        <Card className="p-6 md:p-10 border-t-4 border-t-cohortBlue">
          <div className="space-y-6 md:space-y-8">
            
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div>
                <label className="block text-xs md:text-sm font-bold text-hyperViolet uppercase tracking-wider mb-2">Active Template</label>
                <div className="p-3 md:p-4 bg-white/10 rounded-xl border border-white/10 text-white flex items-center gap-2 md:gap-3 font-semibold text-base md:text-lg">
                  <Cpu size={18} className="text-cohortBlue md:w-5 md:h-5" />
                  <span className="truncate">{currentTemplate?.name || 'No Protocol Loaded'}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-bold text-hyperViolet uppercase tracking-wider mb-2">Team Count</label>
                <div className="flex flex-col gap-2">
                    {/* CUSTOM NEON SLIDER */}
                    <NeonSlider 
                        min={1} 
                        max={maxTeamCount}
                        value={teamCount}
                        onChange={(e) => setTeamCount(parseInt(e.target.value) || 1)}
                    />

                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm md:text-base text-slate-400">1 Squad</span>
                        <span 
                            className="text-3xl md:text-4xl font-extrabold font-mono" 
                            style={{ color: DS.pictonBlue, textShadow: `0 0 15px ${DS.pictonBlue}A0` }}
                        >
                            {teamCount}
                        </span>
                        <span className="text-sm md:text-base text-slate-400">Max ({maxTeamCount})</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Validation Feedback */}
            <div className={`p-4 rounded-xl flex items-start gap-3 border ${validation.valid ? 'bg-plasmaGreen/10 text-plasmaGreen border-plasmaGreen/40' : 'bg-laserRed/10 text-laserRed border-laserRed/40'}`}>
              {validation.valid ? <Check className="mt-1" size={20} /> : <AlertCircle className="mt-1" size={20} />}
              <div>
                <p className="font-extrabold text-lg">{validation.valid ? "System Status: Nominal" : "System Status: Resource Alert"}</p>
                {!validation.valid && <p className="text-sm opacity-90 mt-1">{validation.message || "Review roles, members, and template to proceed."}</p>}
                {validation.valid && (
                    <p className="text-sm opacity-90 mt-1">
                        Ready to deploy {members.length} personnel into {teamCount} balanced squads.
                    </p>
                )}
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
                  <RefreshCw className="animate-spin" size={20} /> Processing Allocation...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Zap size={22}/> Initiate Randomization
                </span>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderResultsTab = () => (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold neon-text-gradient tracking-wide">Allocation Results</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            {generatedGroups.length} balanced squads generated from "{generatedGroups[0]?.templateName || 'Custom'}" protocol.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto">
          <Button variant="glass" onClick={() => setActiveTab('generate')} icon={RefreshCw} className="w-full sm:w-auto justify-center">
            <span className="hidden sm:inline">Reshuffle Matrix</span>
            <span className="sm:hidden">Reshuffle</span>
          </Button>
          <Button variant="primary" onClick={exportCSV} icon={Download} className="w-full sm:w-auto justify-center">
            <span className="hidden sm:inline">Export Data Stream</span>
            <span className="sm:hidden">Export CSV</span>
          </Button>
        </div>
      </div>
      
      {/* Generation Log / Audit */}
      <Card className="p-3 md:p-4 bg-white/5 border-white/10">
        <h3 className="text-xs md:text-sm font-extrabold text-cohortBlue mb-2">Audit Log / Generation Trace</h3>
        <div className="max-h-32 overflow-y-auto custom-scrollbar text-xs text-slate-500 font-mono space-y-0.5">
          {generationLog.map((log, index) => (
            <p key={index} className={log.includes('WARNING') ? 'text-laserRed' : ''}>{log}</p>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {generatedGroups.map((group, idx) => {
          // Use CosmicStream gradient for the top bar
          const gradient = `linear-gradient(90deg, ${DS.pictonBlue}, ${DS.electricPurple})`; // Enhanced gradient
          
          return (
            <div 
              key={group.id} 
              className="relative overflow-hidden cohort-card p-0 transition-transform hover:-translate-y-1 hover:shadow-2xl"
              style={{ boxShadow: `0 0 30px ${DS.hyperViolet}30` }}
            >
              {/* Header Bar - Gradient */}
              <div className={`h-2 w-full`} style={{ background: gradient }}></div>
              
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg md:text-xl font-extrabold tracking-wide text-white truncate`}>
                      {group.name}
                    </h3>
                    <p className="text-xs text-hyperViolet uppercase tracking-widest mt-1 font-bold">Squadron {String(idx + 1).padStart(2, '0')}</p>
                  </div>
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center border border-cohortBlue/50 flex-shrink-0 ml-2`} style={{ color: DS.cohortBlue }}>
                    <Users size={14} className="md:w-4 md:h-4" />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  {group.members.map((member) => {
                    const roleHex = member.roleHex || DS.cohortBlue;
                    return (
                      <div key={member.id} className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 gap-2">
                        <span className="text-slate-200 text-xs md:text-sm truncate font-medium flex-1 min-w-0">{member.name}</span>
                        <Badge roleHex={roleHex} className="text-xs flex-shrink-0">{member.roleName}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {members.filter(m => !generatedGroups.flatMap(g => g.members).map(m => m.id).includes(m.id)).length > 0 && (
          <Card className="sm:col-span-2 xl:col-span-3">
            <h3 className="text-xl font-bold text-laserRed mb-4 flex items-center gap-2">
              <AlertCircle size={20} /> Unassigned Personnel (Leftover Pool)
            </h3>
            <div className="flex flex-wrap gap-3">
              {members.filter(m => !generatedGroups.flatMap(g => g.members).map(m => m.id).includes(m.id)).map(member => {
                const role = roles.find(r => r.id === member.roleId);
                const roleHex = getRoleHex(member.roleId);
                return (
                  <Badge key={member.id} roleHex={roleHex}>{member.name} ({role?.name})</Badge>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  // --- Render Navigation & Layout ---
  
  // Landing Page Component
  const renderLandingPage = () => (
    <div className="min-h-screen text-white font-sans selection:bg-hyperViolet/50 overflow-hidden page-transition" style={{ backgroundColor: DS.starfieldBlack }}>
      {/* Inject Custom Styles */}
      <CohortStyles />

      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-cohortBlue/20 rounded-full blur-[120px] md:blur-[200px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] md:w-[900px] md:h-[900px] bg-cosmicPink/15 rounded-full blur-[150px] md:blur-[250px] animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-electricPurple/10 rounded-full blur-[100px] md:blur-[180px] animate-pulse animation-delay-2000"></div>
      </div>


      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${DS.cohortBlue}20 1px, transparent 1px), linear-gradient(90deg, ${DS.cohortBlue}20 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }}></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-6xl w-full mx-auto">
            {/* Logo and Badge */}
            <div className="text-center mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center justify-center mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-cohortBlue via-hyperViolet to-cosmicPink flex items-center justify-center shadow-2xl animate-pulse" 
                     style={{ boxShadow: `0 0 40px ${DS.cohortBlue}80, 0 0 80px ${DS.hyperViolet}40` }}>
                  <Rocket className="text-white" size={40} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 mb-6 md:mb-8">
                <Zap size={16} className="text-plasmaGreen animate-pulse" />
                <span className="text-xs md:text-sm font-bold text-slate-300 tracking-wider">INTELLIGENT TEAM BUILDER</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 md:mb-6 leading-tight">
                <span className="text-white">Team</span>
                <span className="neon-text-gradient"> Cohort</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium px-4">
                Build balanced, high-performing teams with smart random allocation. 
                <span className="text-cohortBlue font-bold"> Effortless. Intelligent. Fair.</span>
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
              {[
                { icon: Users, title: 'Smart Allocation', desc: 'Random team distribution based on roles and skills', color: DS.cohortBlue },
                { icon: Zap, title: 'Instant Generation', desc: 'Create balanced teams in seconds with one click', color: DS.electricPurple },
                { icon: Settings, title: 'Fully Customizable', desc: 'Define roles, templates, and team structures', color: DS.cosmicPink },
              ].map((feature, idx) => (
                <div key={idx} className="cohort-card p-6 md:p-8 group hover:scale-105 transition-all duration-500" 
                     style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl mb-4 flex items-center justify-center" 
                       style={{ backgroundColor: `${feature.color}20`, boxShadow: `0 0 20px ${feature.color}40` }}>
                    <feature.icon size={28} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm md:text-base text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="text-center space-y-4 md:space-y-0 md:space-x-4 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
              <button 
                onClick={() => setShowLanding(false)}
                className="btn-primary-cohort text-white px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all duration-400 flex items-center gap-3 mx-auto md:inline-flex w-full md:w-auto justify-center"
                style={{ boxShadow: `0 0 40px ${DS.hyperViolet}60, 0 10px 50px ${DS.cohortBlue}30` }}
              >
                <Rocket size={24} />
                Launch Team Builder
              </button>
              
              <a 
                href="https://github.com/mutahir-muhammad/Cohort" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-glass px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold rounded-2xl hover:scale-105 transition-all duration-400 flex items-center gap-3 mx-auto md:inline-flex w-full md:w-auto justify-center"
              >
                <Copy size={20} />
                View on GitHub
              </a>
            </div>

            {/* Stats Section */}
            <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-800">
              {[
                { label: 'Team Templates', value: '10+' },
                { label: 'Fair Distribution', value: '100%' },
                { label: 'Success Rate', value: '99.9%' },
                { label: 'Time Saved', value: '90%' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-4 md:p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                  <div className="text-2xl md:text-4xl font-extrabold neon-text-gradient mb-2">{stat.value}</div>
                  <div className="text-xs md:text-sm text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 py-6 md:py-8 px-4 text-center">
          <p className="text-xs md:text-sm text-slate-500">
            Built with <span className="text-cosmicPink">♥</span> by Muhammad Mutahir
          </p>
          <p className="text-xs text-slate-600 mt-2">© 2025 Cohort. Empowerment Through Learning.</p>
        </footer>
      </div>
    </div>
  );

  // Main App (Dashboard)
  const renderMainApp = () => (
    <div className="min-h-screen text-white font-sans selection:bg-hyperViolet/50 page-transition" style={{ backgroundColor: DS.starfieldBlack }}>
      
      {/* Inject Custom Styles */}
      <CohortStyles />

      {/* Background Ambience - Floating Particles/Cohort Drift */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-cohortBlue/10 rounded-full blur-[120px] md:blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-cosmicPink/10 rounded-full blur-[150px] animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 lg:px-8 py-6 md:py-12 max-w-7xl">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 border-b border-white/10 pb-6 md:pb-8 gap-4">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={() => setShowLanding(true)}
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-cohortBlue to-hyperViolet flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer" 
                style={{ boxShadow: `0 0 20px ${DS.cohortBlue}60` }}
                title="Back to Landing Page"
              >
                <Rocket className="text-white" size={24} />
              </button>
              <div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">Team<span className="neon-text-gradient">Cohort</span></h1>
                <p className="text-xs text-hyperViolet uppercase tracking-widest mt-1 font-bold hidden sm:block">Empowerment Through Learning</p>
              </div>
            </div>
          </div>
          
          {/* Nav Tabs - Glassmorphism Navbar */}
          <nav className="flex p-1.5 md:p-2 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-x-auto shadow-lg shadow-black/30 w-full md:w-auto">
            {[
              { id: 'roles', label: 'Roles', icon: Settings },
              { id: 'members', label: 'Personnel', icon: Users },
              { id: 'templates', label: 'Templates', icon: Copy },
              { id: 'generate', label: 'Generate', icon: Cpu },
              { id: 'results', label: 'Results', icon: Check, disabled: generatedGroups.length === 0 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-hyperViolet text-white shadow-xl shadow-hyperViolet/30' 
                    : 'text-slate-300 hover:text-cohortBlue hover:bg-white/10'
                } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <tab.icon size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[400px] md:min-h-[600px] pb-8 md:pb-12">
          {activeTab === 'roles' && renderRolesTab()}
          {activeTab === 'members' && renderMembersTab()}
          {activeTab === 'templates' && renderTemplatesTab()}
          {activeTab === 'generate' && renderGenerateTab()}
          {activeTab === 'results' && renderResultsTab()}
        </main>
      </div>
    </div>
  );
  
  return showLanding ? renderLandingPage() : renderMainApp();
}