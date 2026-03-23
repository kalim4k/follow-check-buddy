import { useState } from 'react';
import { Search, User, CheckCircle2, ArrowLeft, Heart, MessageCircle, UserCheck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_USERS = [
  { id: 1, username: 'alex_dev', name: 'Alexandre', verified: false, isSubscribed: true, hasLiked: false, hasCommented: true },
  { id: 2, username: 'marie.design', name: 'Marie UX', verified: true, isSubscribed: true, hasLiked: true, hasCommented: false },
  { id: 3, username: 'lucas_99', name: 'Lucas', verified: false, isSubscribed: false, hasLiked: false, hasCommented: false },
  { id: 4, username: 'sophie_art', name: 'Sophie', verified: false, isSubscribed: true, hasLiked: true, hasCommented: true },
  { id: 5, username: 'thomas.code', name: 'Thomas', verified: true, isSubscribed: false, hasLiked: true, hasCommented: false },
];

type MockUser = typeof MOCK_USERS[number];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  const searchResults = MOCK_USERS.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div layout className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
          <AnimatePresence mode="wait">
            {!selectedUser ? (
              <motion.div
                key="main"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 pb-4 flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <img
                      src="https://ysbiedwkakdqadxtuwab.supabase.co/storage/v1/object/public/uploads/9ce85a0a-900a-4f90-aa08-2f38c38d280d.jpg"
                      alt="Michel Samah"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-foreground flex items-center justify-center border-2 border-card">
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <h1 className="text-xl font-bold text-foreground">Michel Samah</h1>
                  <p className="text-sm text-muted-foreground">@roomtok7</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-4 text-center">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">26</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Abonnements</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">10K</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Abonnés</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">32.5K</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">J'aime</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="w-full h-px bg-border mb-5" />

                  <div className="mb-4">
                    <h2 className="text-base font-semibold text-foreground">Vérificateur d'interaction</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Recherchez un utilisateur pour vérifier son activité.</p>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                      <Search className={`w-4 h-4 transition-colors duration-200 ${isFocused ? 'text-foreground' : 'text-muted-foreground'}`} />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Username TikTok..."
                      className="w-full bg-secondary border border-border rounded-2xl py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground focus:bg-card transition-all duration-200"
                    />
                  </div>

                  {/* Results */}
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 bg-card border border-border rounded-2xl p-2 shadow-lg"
                      >
                        {searchResults.length > 0 ? (
                          searchResults.map((user) => (
                            <div
                              key={user.id}
                              onClick={() => {
                                setSelectedUser(user);
                                setSearchQuery('');
                              }}
                              className="flex items-center gap-3 p-2.5 hover:bg-secondary rounded-xl cursor-pointer transition-colors"
                            >
                              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                                <User className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-medium text-foreground">{user.username}</span>
                                  {user.verified && <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />}
                                </div>
                                <p className="text-xs text-muted-foreground">{user.name}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-sm text-muted-foreground">
                            Aucun utilisateur trouvé
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <h2 className="text-lg font-semibold text-foreground">Rapport d'interaction</h2>
                </div>

                {/* User Profile */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-semibold text-foreground">{selectedUser.username}</h3>
                    {selectedUser.verified && <CheckCircle2 className="w-4 h-4 text-foreground" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
                </div>

                {/* Interaction Checklist */}
                <div className="bg-secondary rounded-2xl p-4">
                  <div className="space-y-3">
                    {/* Subscription */}
                    <div className="flex items-center justify-between p-3 bg-card rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Abonnement</p>
                          <p className="text-xs text-muted-foreground">Suit @roomtok7</p>
                        </div>
                      </div>
                      {selectedUser.isSubscribed ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>

                    {/* Like */}
                    <div className="flex items-center justify-between p-3 bg-card rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <Heart className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Mention J'aime</p>
                          <p className="text-xs text-muted-foreground">A liké la dernière vidéo</p>
                        </div>
                      </div>
                      {selectedUser.hasLiked ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>

                    {/* Comment */}
                    <div className="flex items-center justify-between p-3 bg-card rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Commentaire</p>
                          <p className="text-xs text-muted-foreground">A commenté la vidéo</p>
                        </div>
                      </div>
                      {selectedUser.hasCommented ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
