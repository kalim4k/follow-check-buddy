import { useState, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, Save, User, Upload, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsers, saveUsers, getStats, saveStats, type UserProfile, type ProfileStats } from '@/lib/store';

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ProfileStats>(getStats());
  const [users, setUsers] = useState<UserProfile[]>(getUsers());
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // New user form
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [newVerified, setNewVerified] = useState(false);
  const [newSubscribed, setNewSubscribed] = useState(false);
  const [newLiked, setNewLiked] = useState(false);
  const [newCommented, setNewCommented] = useState(false);

  const handleSaveStats = () => {
    saveStats(stats);
    saveUsers(users);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addUser = () => {
    if (!newUsername.trim()) return;
    const newUser: UserProfile = {
      id: Date.now(),
      username: newUsername.trim(),
      name: newName.trim() || newUsername.trim(),
      photoUrl: newPhoto.trim(),
      verified: newVerified,
      isSubscribed: newSubscribed,
      hasLiked: newLiked,
      hasCommented: newCommented,
    };
    const updated = [...users, newUser];
    setUsers(updated);
    saveUsers(updated);
    setNewUsername('');
    setNewName('');
    setNewPhoto('');
    setNewVerified(false);
    setNewSubscribed(false);
    setNewLiked(false);
    setNewCommented(false);
  };

  const removeUser = (id: number) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    saveUsers(updated);
  };

  const toggleUserField = (id: number, field: 'isSubscribed' | 'hasLiked' | 'hasCommented' | 'verified') => {
    const updated = users.map(u => u.id === id ? { ...u, [field]: !u[field] } : u);
    setUsers(updated);
    saveUsers(updated);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Panneau d'administration</h1>
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Statistiques du profil</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide mb-1 block">Abonnements</label>
              <input
                type="text"
                value={stats.abonnements}
                onChange={e => setStats({ ...stats, abonnements: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide mb-1 block">Abonnés</label>
              <input
                type="text"
                value={stats.abonnes}
                onChange={e => setStats({ ...stats, abonnes: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide mb-1 block">J'aime</label>
              <input
                type="text"
                value={stats.jaime}
                onChange={e => setStats({ ...stats, jaime: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleSaveStats}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-foreground text-primary-foreground rounded-xl py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Enregistré !' : 'Enregistrer'}
          </button>
        </div>

        {/* Add User Section */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Ajouter un profil</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground transition-all"
              />
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Nom"
                className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground transition-all"
              />
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-secondary border border-border border-dashed rounded-xl py-4 px-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted transition-colors"
            >
              {newPhoto ? (
                <div className="flex items-center gap-3">
                  <img src={newPhoto} alt="Preview" className="w-10 h-10 rounded-full object-cover" />
                  <span className="text-sm text-foreground">Photo sélectionnée</span>
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Importer une photo de profil</span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Vérifié', checked: newVerified, set: setNewVerified },
                { label: 'Abonné', checked: newSubscribed, set: setNewSubscribed },
                { label: 'A liké', checked: newLiked, set: setNewLiked },
                { label: 'A commenté', checked: newCommented, set: setNewCommented },
              ].map(item => (
                <label key={item.label} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => item.set(!item.checked)}
                    className="w-4 h-4 rounded accent-foreground"
                  />
                  {item.label}
                </label>
              ))}
            </div>
            <button
              onClick={addUser}
              disabled={!newUsername.trim()}
              className="w-full flex items-center justify-center gap-2 bg-foreground text-primary-foreground rounded-xl py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Profils ({users.length})
          </h2>
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="bg-secondary rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.name}</p>
                  </div>
                  <button
                    onClick={() => removeUser(user.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {([
                    { field: 'verified' as const, label: 'Vérifié' },
                    { field: 'isSubscribed' as const, label: 'Abonné' },
                    { field: 'hasLiked' as const, label: 'Liké' },
                    { field: 'hasCommented' as const, label: 'Commenté' },
                  ]).map(item => (
                    <button
                      key={item.field}
                      onClick={() => toggleUserField(user.id, item.field)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        user[item.field]
                          ? 'bg-foreground text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
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
