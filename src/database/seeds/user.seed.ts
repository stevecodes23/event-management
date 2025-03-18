import { User } from '../../modules/auth/entities/user.entity';
import { UserRole } from '../../modules/auth/entities/user.entity';
import { generateHash } from '../../utils/app.utils';
import { dataSource } from '../data-source';

async function seedAdmin() {
  await dataSource.initialize();
  console.log('Database connected');

  const userRepository = dataSource.getRepository(User);

  const existingAdmin = await userRepository.findOne({
    where: { role: UserRole.ADMIN, email: 'admin@admin.com' },
  });
  if (existingAdmin) {
    console.log('Admin user already exists');
    await dataSource.destroy();
    return;
  }

  const adminUser = new User();
  adminUser.name = 'Admin';
  adminUser.email = 'admin@admin.com';
  adminUser.password = await generateHash('test');
  adminUser.role = UserRole.ADMIN;

  await userRepository.save(adminUser);
  console.log('Admin user seeded');

  await dataSource.destroy();
}

seedAdmin().catch((error) => {
  console.error('Error seeding admin user:', error);
  process.exit(1);
});
