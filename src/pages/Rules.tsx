import { motion } from "framer-motion";
import { Shield, Users, Flag, AlertTriangle, BookOpen, Terminal } from "lucide-react";
import CyberCard from "@/components/CyberCard";
import { GlitchText } from "@/components/GlitchText";

const Rules = () => {
  const sections = [
    {
      title: "General Protocols",
      icon: <Terminal className="w-5 h-5" />,
      rules: [
        "Register before the event initialization sequence.",
        "Team size capacity: 2-4 operators.",
        "Flag sharing is a strict violation of protocol.",
        "Independent problem solving is mandatory.",
        "External network access is permitted unless restricted.",
        "Platform brute-forcing is forbidden.",
      ],
    },
    {
      title: "Squad Configuration",
      icon: <Users className="w-5 h-5" />,
      rules: [
        "Operators per unit: 2-4 max.",
        "Single unit affiliation per operator.",
        "Unit identifiers must be compliant (non-offensive).",
        "Designate one Unit Commander for comms.",
        "Post-registration unit merging is locked.",
      ],
    },
    {
      title: "Flag Syntax",
      icon: <Flag className="w-5 h-5" />,
      rules: [
        "Standard format: XPLOIT{payload}",
        "Case-sensitivity: ACTIVE.",
        "Syntax precision: STRICT (no whitespace).",
        "One unique key per challenge node.",
      ],
    },
    {
      title: "Termination Criteria",
      icon: <AlertTriangle className="w-5 h-5" />,
      rules: [
        "Infrastructure attacks = ID BAN.",
        "Flag sharing = UNIT DISQUALIFICATION.",
        "Sabotage of rival units = IMMEDIATE EJECTION.",
        "Automated scanners against score server = FORBIDDEN.",
        "Impersonation = PERMANENT BAN.",
      ],
    },
    {
      title: "Code of Conduct",
      icon: <Shield className="w-5 h-5" />,
      rules: [
        "Respect all entities in the network.",
        "Harassment protocol: ZERO TOLERANCE.",
        "Report anomalies to Admins immediately.",
        "Objective: Knowledge acquisition & enjoyment.",
      ],
    },
    {
      title: "Resources & Help",
      icon: <BookOpen className="w-5 h-5" />,
      rules: [
        "Official comms channel: Discord.",
        "Ticket system active for disputes.",
        "Read challenge descriptions carefully.",
        "Hints may be dispensed at cost.",
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-background/90 to-background pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <GlitchText
            text="MISSION PROTOCOLS"
            as="h1"
            enableGlitch={false}
            className="text-4xl md:text-6xl text-primary font-bold mb-4 tracking-tight neon-text-red hover:-translate-y-1 hover:translate-x-1 transition-transform duration-200 cursor-default"
          />
          <p className="font-terminal text-muted-foreground max-w-2xl mx-auto">
            {">"} Review engagement rules before commencing operations_
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <CyberCard
              key={index}
              title={section.title}
              icon={section.icon}
              delay={index * 0.1}
            >
              <ul className="space-y-3">
                {section.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">▹</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CyberCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rules;
