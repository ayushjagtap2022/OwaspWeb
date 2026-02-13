import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, initStore } from '@/lib/store';
import { registerUser as registerUserAPI } from '@/lib/api';

initStore();

type Mode = 'register' | 'login';

const Register = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('register');
  const [step, setStep] = useState(0);

  // Registration fields
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [teamName, setTeamName] = useState('');

  // Login fields
  const [loginAlias, setLoginAlias] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [messages, setMessages] = useState<{ text: string; type: 'info' | 'error' | 'success' }[]>([
    { text: '> SECURE REGISTRATION TERMINAL v2.1', type: 'info' },
    { text: '> Enter your credentials to initialize access...', type: 'info' },
  ]);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addMsg = (text: string, type: 'info' | 'error' | 'success') =>
    setMessages(prev => [...prev, { text, type }]);

  const handleRegisterStep = async () => {
    if (step === 0) {
      if (!name.trim() || name.length < 3) {
        addMsg('ERROR: name must be at least 3 characters', 'error');
        return;
      }
      addMsg(`> name: ${name}`, 'info');
      setStep(1);
    } else if (step === 1) {
      if (!phoneNumber.trim() || phoneNumber.length < 10) {
        addMsg('ERROR: phone number must be at least 10 digits', 'error');
        return;
      }
      addMsg(`> phone: ${phoneNumber}`, 'info');
      setStep(2);
    } else if (step === 2) {
      if (!email.includes('@')) {
        addMsg('ERROR: invalid email format', 'error');
        return;
      }
      addMsg(`> email: ${email}`, 'info');
      setStep(3);
    } else if (step === 3) {
      if (password.length < 6) {
        addMsg('ERROR: password must be at least 6 characters', 'error');
        return;
      }
      addMsg('> password: ********', 'info');
      setStep(4);
    } else if (step === 4) {
      if (!collegeName.trim()) {
        addMsg('ERROR: college name is required', 'error');
        return;
      }
      addMsg(`> college: ${collegeName}`, 'info');
      setStep(5);
    } else if (step === 5) {
      // Team name is optional
      if (teamName.trim()) {
        addMsg(`> team: ${teamName}`, 'info');
      } else {
        addMsg('> team: [none]', 'info');
      }
      addMsg('> Processing registration...', 'info');
      setIsLoading(true);

      const result = await registerUserAPI({
        name,
        phoneNumber,
        email,
        password,
        collegeName,
        teamName: teamName.trim() || undefined,
      });

      setIsLoading(false);

      if (result.success) {
        addMsg('> USER CREATED SUCCESSFULLY', 'success');
        addMsg(`> Welcome, ${name}. You are now registered.`, 'success');
        if (result.data?.team) {
          addMsg(`> Team "${result.data.team.teamName}" created successfully.`, 'success');
        }
        addMsg('> Redirecting to login...', 'info');
        setDone(true);
        setTimeout(() => {
          setMode('login');
          setStep(0);
          setDone(false);
          setMessages([{ text: '> LOGIN TERMINAL', type: 'info' }]);
        }, 2000);
      } else {
        addMsg(result.message || 'ERROR: registration failed', 'error');
        setStep(0);
      }
    }
  };

  const handleLogin = () => {
    if (!loginAlias.trim()) {
      addMsg('ERROR: alias required', 'error');
      return;
    }
    if (!loginPassword) {
      addMsg('ERROR: password required', 'error');
      return;
    }
    const result = loginUser(loginAlias, loginPassword);
    if (result.success) {
      addMsg(`> ACCESS GRANTED. Welcome back, ${loginAlias}.`, 'success');
      setDone(true);
      setTimeout(() => navigate('/challenges'), 1500);
    } else {
      addMsg(result.error || 'ERROR: login failed', 'error');
    }
  };

  const prompts = [
    'Enter your full name',
    'Enter phone number',
    'Enter email address',
    'Enter password',
    'Enter college name',
    'Enter team name (optional, press Enter to skip)'
  ];

  const getCurrentValue = () => {
    switch (step) {
      case 0: return name;
      case 1: return phoneNumber;
      case 2: return email;
      case 3: return password;
      case 4: return collegeName;
      case 5: return teamName;
      default: return '';
    }
  };

  const handleCurrentValueChange = (value: string) => {
    switch (step) {
      case 0: setName(value); break;
      case 1: setPhoneNumber(value); break;
      case 2: setEmail(value); break;
      case 3: setPassword(value); break;
      case 4: setCollegeName(value); break;
      case 5: setTeamName(value); break;
    }
  };

  return (
    <div className="noise-bg min-h-screen flex items-center justify-center px-4">
      <div className="crt-overlay" />
      <div className="w-full max-w-xl border border-border bg-card/80 p-6">
        {/* Title bar */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <div className="w-3 h-3 rounded-full bg-terminal-amber" />
          <div className="w-3 h-3 rounded-full bg-terminal-green" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">
            {mode === 'register' ? 'registration_terminal' : 'login_terminal'} — bash
          </span>
        </div>

        {/* Messages */}
        <div className="space-y-1 mb-4 max-h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <p
              key={i}
              className={`font-mono text-sm ${msg.type === 'error' ? 'text-primary' :
                  msg.type === 'success' ? 'text-terminal-green green-glow' :
                    'text-foreground'
                }`}
            >
              {msg.text}
            </p>
          ))}
        </div>

        {/* Input */}
        {!done && (
          <div className="space-y-3">
            {mode === 'register' ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-terminal-green font-mono text-sm">$</span>
                  <input
                    type={step === 3 ? 'password' : 'text'}
                    value={getCurrentValue()}
                    onChange={e => handleCurrentValueChange(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !isLoading && handleRegisterStep()}
                    placeholder={prompts[step]}
                    className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleRegisterStep}
                  disabled={isLoading}
                  className="w-full py-2 border border-primary text-primary font-mono text-sm uppercase tracking-widest red-glow hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  [ {isLoading ? 'Processing...' : step === 5 ? 'Register' : 'Continue'} ]
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-terminal-green font-mono text-sm">alias$</span>
                    <input
                      value={loginAlias}
                      onChange={e => setLoginAlias(e.target.value)}
                      placeholder="Enter alias"
                      className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-terminal-green font-mono text-sm">pass$</span>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      placeholder="Enter password"
                      className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <button
                  onClick={handleLogin}
                  className="w-full py-2 border border-primary text-primary font-mono text-sm uppercase tracking-widest red-glow hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  [ Login ]
                </button>
              </>
            )}
            <button
              onClick={() => {
                setMode(mode === 'register' ? 'login' : 'register');
                setStep(0);
                setMessages([{ text: mode === 'register' ? '> LOGIN TERMINAL' : '> REGISTRATION TERMINAL', type: 'info' }]);
              }}
              className="w-full font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {mode === 'register' ? '> Already have access? Login instead' : '> Need access? Register instead'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
