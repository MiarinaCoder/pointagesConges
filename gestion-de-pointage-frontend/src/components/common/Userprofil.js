import styles from '../../styles/components/Menu.module.css';
import { FaUserCircle,FaBriefcase,FaCog,FaBuilding } from 'react-icons/fa';
import Image from 'next/image';

const UserProfile = ({ user }) => {
    return (
      <div className={styles.userProfile}>
        <div className={styles.userAvatarWrapper}>
          {user?.photoUrl ? (
            <Image
              src={user.photoUrl} 
              alt={`${user.prenom} ${user.nom}`} 
              className={styles.userAvatar}
            />
          ) : (
            <div className={styles.userAvatarFallback}>
              <FaUserCircle className={styles.avatarIcon} />
            </div>
          )}
          <div className={styles.userStatusIndicator} 
               title={`Status: ${user?.status || 'En ligne'}`} />
        </div>
        
        <div className={styles.userInfoContainer}>
          <h2 className={styles.userName}>
            {`${user?.prenom || ''}`}
          </h2>
          <div className={styles.userMeta}>
            <span className={styles.userRole}>
              <FaBriefcase className={styles.roleIcon} />
              {user?.fonction === 'employe' ? 'employé' : user?.fonction || 'Utilisateur'}
            </span>
            {/* <span className={styles.userDepartment}>
              <FaBuilding className={styles.departmentIcon} />
              {user?.departement || 'Non assigné'}
            </span> */}
          </div>
        </div>
        
        {/* <button className={styles.profileSettingsButton}
                onClick={() => router.push('/profile')}
                title="Paramètres du profil">
          <FaCog className={styles.settingsIcon} />
        </button> */}
      </div>
    );
  };

export default UserProfile;