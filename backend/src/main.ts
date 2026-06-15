import { UserRole } from './user/user.entity';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/provider/user.service';
import * as bcrypt from 'bcrypt'; // 1. Import bcrypt

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userService = app.get(UserService);
  const defaultAdminEmail = 'admin@g.com';
  const adminExists = await userService.findOneByEmail(defaultAdminEmail);

  if (!adminExists) {
    console.log('No admin found. Creating default admin user...');
    
    // 2. Hash the password with a salt round of 10
    const hashedPassword = await bcrypt.hash('admin123', 10); 

    await userService.create({
      email: defaultAdminEmail,
      passwordHash: hashedPassword, // 3. Save the hash instead
    });
    console.log('Default admin user created successfully!');
  }

  await app.listen(3000);
}
bootstrap();