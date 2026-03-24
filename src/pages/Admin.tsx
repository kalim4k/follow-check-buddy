import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, Save, User, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getUsers, addUser, removeUser, updateUser,
  getStats, saveStats, uploadProfilePhoto,
  type UserProfile, type ProfileStats,
} from '@/lib/store';

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ProfileStats>({ abonnements: '26', abonnes: '10K', jaime: '32.5K' });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New user form
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState('');
  const [newVerified, setNewVerified] = useState(false);
  const [newSubscribed, setNewSubscribed] = useState(false);
  const [newLiked, setNewLiked] = useState(false);
  const [newCommented, setNewCommented] = useState(false);
  const [newShared, setNewShared] = useState(false);
  const [newReposted, setNewReposted] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      const [s, u] = await Promise.all([getStats(), getUsers()]);
      setStats(s);
      setUsers(u);
      setLoading(false);
    })();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setNewPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveStats = async () => {
    await saveStats({ abonnements: stats.abonnements, abonnes: stats.abonnes, jaime: stats.jaime });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddUser = async () => {
    if (!newUsername.trim()) return;
    setAdding(true);
    let photoUrl = '';
    if (newPhotoFile) {
      const url = await uploadProfilePhoto(newPhotoFile);
      if (url) photoUrl = url;
    }
    const newUser = await addUser({
      username: newUsername.trim(),
      name: newName.trim() || newUsername.trim(),
      photo_url: photoUrl,
      verified: newVerified,
      is_subscribed: newSubscribed,
      has_liked: newLiked,
      has_commented: newCommented,
      has_shared: newShared,
      has_reposted: newReposted,
    });
    if (newUser) setUsers(prev => [...prev, newUser]);
    setNewUsername('');
    setNewName('');
    setNewPhotoFile(null);
    setNewPhotoPreview('');
    setNewVerified(false);
    setNewSubscribed(false);
    setNewLiked(false);
    setNewCommented(false);
    setNewShared(false);
    setNewReposted(false);
    setAdding(false);
  };

  const handleRemoveUser = async (id: number) => {
    await removeUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleUserField = async (id: number, field: 'is_subscribed' | 'has_liked' | 'has_commented' | 'verified') => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const newValue = !user[field];
    await updateUser(id, { [field]: newValue });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: newValue } : u));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Panneau d'administration</h1>
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Statistiques du profil</h2>
          <div className="grid grid-cols-3 gap-3">
            {(['abonnements', 'abonnes', 'jaime'] as const).map(key => (
              <div key={key}>
                <label className="text-xs text-muted-foreground uppercase tracking-wide mb-1 block">
                  {key === 'abonnements' ? 'Abonnements' : key === 'abonnes' ? 'Abonnés' : "J'aime"}
                </label>
                <input
                  type="text"
                  value={stats[key]}
                  onChange={e => setStats({ ...stats, [key]: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground transition-all"
                />
              </div>
            ))}
          </div>
          <button onClick={handleSaveStats} className="mt-4 w-full flex items-center justify-center gap-2 bg-foreground text-primary-foreground rounded-xl py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" />
            {saved ? 'Enregistré !' : 'Enregistrer'}
          </button>
        </div>

        {/* Add User Section */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Ajouter un profil</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="Username" className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground transition-all" />
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nom" className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground transition-all" />
            </div>
            <div onClick={() => fileInputRef.current?.click()} className="w-full bg-secondary border border-border border-dashed rounded-xl py-4 px-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted transition-colors">
              {newPhotoPreview ? (
                <div className="flex items-center gap-3">
                  <img src={newPhotoPreview} alt="Preview" className="w-10 h-10 rounded-full object-cover" />
                  <span className="text-sm text-foreground">Photo sélectionnée</span>
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Importer une photo de profil</span>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Vérifié', checked: newVerified, set: setNewVerified },
                { label: 'Abonné', checked: newSubscribed, set: setNewSubscribed },
                { label: 'A liké', checked: newLiked, set: setNewLiked },
                { label: 'A commenté', checked: newCommented, set: setNewCommented },
              ].map(item => (
                <label key={item.label} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={item.checked} onChange={() => item.set(!item.checked)} className="w-4 h-4 rounded accent-foreground" />
                  {item.label}
                </label>
              ))}
            </div>
            <button onClick={handleAddUser} disabled={!newUsername.trim() || adding} className="w-full flex items-center justify-center gap-2 bg-foreground text-primary-foreground rounded-xl py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40">
              <Plus className="w-4 h-4" />
              {adding ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">Profils ({users.length})</h2>
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="bg-secondary rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2">
                  {user.photo_url ? (
                    <img src={user.photo_url} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.name}</p>
                  </div>
                  <button onClick={() => handleRemoveUser(user.id)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {([
                    { field: 'verified' as const, label: 'Vérifié' },
                    { field: 'is_subscribed' as const, label: 'Abonné' },
                    { field: 'has_liked' as const, label: 'Liké' },
                    { field: 'has_commented' as const, label: 'Commenté' },
                  ]).map(item => (
                    <button key={item.field} onClick={() => toggleUserField(user.id, item.field)} className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${user[item.field] ? 'bg-foreground text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
