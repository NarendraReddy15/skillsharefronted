import { Link } from 'react-router-dom';
import { MapPin, Briefcase, MessageCircle, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '@/types';
import Badge from '@/components/ui/Badge';

interface ProfileCardProps {
  user: User;
  showActions?: boolean;
  onMessage?: () => void;
  onAddFriend?: () => void;
}

const ProfileCard = ({ user, showActions, onMessage, onAddFriend }: ProfileCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/60 rounded-2xl border border-gray-700/50 overflow-hidden hover:border-primary-500/30 transition-colors"
  >
    <div className="relative h-28 bg-gradient-primary">
      <div className="absolute -bottom-6 left-4">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-800" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gray-700 ring-4 ring-gray-800 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{user.name[0]}</span>
          </div>
        )}
      </div>
    </div>

    <div className="pt-10 px-4 pb-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <Link to={`/profile/${user._id}`} className="font-bold text-white hover:text-primary-400 transition-colors">
            {user.name}
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
            {user.experience && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> {user.experience}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {user.location}
              </span>
            )}
          </div>
        </div>
        {user.isOnline && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online
          </span>
        )}
      </div>

      {user.bio && <p className="text-gray-400 text-xs line-clamp-2 mb-3">{user.bio}</p>}

      <div className="flex flex-wrap gap-1 mb-3">
        {user.skills.slice(0, 3).map((skill) => (
          <Badge key={skill.name} variant="skill" className="text-xs">{skill.name}</Badge>
        ))}
        {user.skills.length > 3 && <Badge className="text-xs">+{user.skills.length - 3}</Badge>}
      </div>

      {showActions && (
        <div className="flex gap-2">
          {onMessage && (
            <button
              onClick={onMessage}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-primary-500/20 text-primary-400 rounded-xl text-xs font-medium hover:bg-primary-500/30 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Message
            </button>
          )}
          {onAddFriend && (
            <button
              onClick={onAddFriend}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-700 text-gray-300 rounded-xl text-xs font-medium hover:bg-gray-600 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
      )}
    </div>
  </motion.div>
);

export default ProfileCard;
