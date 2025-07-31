# CivilSoul - Social Service & Wellness Platform

![CivilSoul Banner](https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80)

## 🌟 Overview

CivilSoul is a comprehensive MERN stack platform that connects volunteers with meaningful opportunities while providing mental health support and wellness resources. Our mission is to create positive social impact through community service, mental health advocacy, and environmental stewardship.

### 🎯 Key Features

- **🤝 Volunteering Hub**: Connect with local and global volunteer opportunities
- **🧠 Mental Health Support**: AI chatbot, counseling booking, and wellness resources
- **📜 Certificate Generation**: Earn verified certificates for volunteer work
- **📝 Self-Assessment Surveys**: Mental health screening and wellness tracking
- **📚 Wellness Blog**: Educational content and success stories
- **🌱 Environmental Initiatives**: Tree planting, cleanup drives, conservation projects
- **👴 Elderly Care Programs**: Companion services and care home support
- **🩸 Blood Donation Drives**: Rural outreach and emergency response
- **🐾 Animal Welfare**: Rescue, rehabilitation, and conservation efforts

## 🏗️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **OpenAI API** - AI chatbot integration
- **Nodemailer** - Email services
- **Cloudinary** - Image storage
- **Socket.io** - Real-time communication

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data fetching
- **Axios** - HTTP client
- **Chart.js** - Data visualization

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/civilsoul.git
   cd civilsoul
   ```

2. **Setup Backend**
   ```bash
   cd Server
   npm install
   cp .env.example .env
   # Configure your environment variables in .env
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../Client
   npm install
   npm start
   ```

4. **Environment Variables**
   
   Create `.env` in the Server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/civilsoul
   CLIENT_URL=http://localhost:3000
   
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   OPENAI_API_KEY=your_openai_api_key
   
   ADMIN_EMAIL=admin@civilsoul.com
   HELPLINE_NUMBER=+1-800-CIVILSOUL
   ```

## 📂 Project Structure

```
CivilSoul/
├── Server/                 # Backend application
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── controllers/       # Route controllers
│   └── server.js          # Entry point
│
├── Client/                # Frontend application
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── package.json
│
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset

### Volunteering
- `GET /api/volunteering` - List opportunities
- `GET /api/volunteering/:id` - Get opportunity details
- `POST /api/volunteering/:id/apply` - Apply for opportunity
- `GET /api/volunteering/my/applications` - User's applications

### Mental Health
- `POST /api/chatbot/chat` - Chat with AI assistant
- `GET /api/counselling/counselors` - List counselors
- `POST /api/counselling/book` - Book session
- `GET /api/surveys` - List surveys
- `POST /api/surveys/:id/submit` - Submit survey

### Certificates
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/my` - User certificates
- `GET /api/certificates/verify/:id` - Verify certificate

## 🤖 AI Chatbot Features

Our AI mental health assistant provides:
- **24/7 Support**: Always available for mental health conversations
- **Evidence-based Guidance**: Coping strategies and wellness tips
- **Crisis Detection**: Identifies urgent situations and provides resources
- **Platform Integration**: Suggests relevant CivilSoul features
- **Privacy-focused**: Conversations are not stored permanently

## 📊 Dashboard Features

### User Dashboard
- Personal volunteer hours tracking
- Certificate collection
- Mental health progress
- Upcoming opportunities
- Impact statistics

### Admin Dashboard
- User management
- Opportunity creation
- Certificate generation
- Analytics and reporting
- Content management

## 🌍 Service Areas

### Environmental Conservation
- Tree planting initiatives
- Beach and park cleanup drives
- Wildlife habitat restoration
- Sustainable living education
- Climate change awareness

### Elderly Care Support
- Companion programs for nursing homes
- Technology training for seniors
- Meals on wheels delivery
- Health monitoring assistance
- Social activity coordination

### Blood Donation Programs
- Mobile blood drives in rural areas
- Emergency blood collection
- Regular donation scheduling
- Health screening services
- Donor education programs

### Animal Welfare Initiatives
- Animal shelter volunteering
- Wildlife conservation projects
- Stray animal rescue operations
- Pet therapy programs
- Animal rights advocacy

## 🏆 Certificate System

### Types of Certificates
- **Volunteering Certificates**: For completed volunteer hours
- **Internship Certificates**: For extended volunteer commitments
- **Completion Certificates**: For finished programs
- **Recognition Awards**: For outstanding contributions

### Certificate Features
- Blockchain-verified authenticity
- QR code verification
- Digital download and sharing
- Professional PDF generation
- LinkedIn integration ready

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file upload handling
- CORS protection
- Helmet.js security headers

## 🧪 Testing

```bash
# Backend tests
cd Server
npm test

# Frontend tests
cd Client
npm test
```

## 📱 Mobile Responsiveness

CivilSoul is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Progressive Web App capabilities

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Crisis Resources

### 24/7 Crisis Support
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **National Domestic Violence Hotline**: 1-800-799-7233
- **SAMHSA National Helpline**: 1-800-662-4357
- **CivilSoul Emergency Helpline**: 1-800-CIVILSOUL

### Getting Help
- 📧 Email: support@civilsoul.org
- 💬 Chat: Available in the app
- 📞 Phone: 1-800-CIVILSOUL
- 🌐 Website: https://civilsoul.org

## 🙏 Acknowledgments

- Mental health professionals who advised on best practices
- Volunteer organizations that provided partnership opportunities
- Open source community for amazing tools and libraries
- All the volunteers and users who make CivilSoul possible

## 🔮 Roadmap

### Version 2.0
- [ ] Mobile app (React Native)
- [ ] Advanced AI chatbot with voice support
- [ ] Virtual reality volunteer training
- [ ] Blockchain certificate verification
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

### Version 2.1
- [ ] Corporate partnership portal
- [ ] Gamification features
- [ ] Social media integration
- [ ] Advanced matching algorithms
- [ ] Peer support networks

---

**Made with ❤️ by the CivilSoul Team**

*Empowering souls to serve, one volunteer at a time.*
