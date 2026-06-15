"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactMessage } from "@/app/actions/public";
import { CheckCircle2 } from "lucide-react";

const initialState: any = {
  success: false,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <div className="relative h-12 w-full mt-6 overflow-hidden rounded-md bg-slate-800">
      <AnimatePresence mode="wait">
        {!pending ? (
          <motion.button
            key="submit-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="submit"
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-cyan-600 font-bold tracking-wide text-white hover:opacity-90 transition-opacity"
            data-track="contact_form_submit"
            data-track-id="contact-form"
          >
            Send Message
          </motion.button>
        ) : (
          <motion.div
            key="loading-bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-cyan-400"
          >
            <div className="absolute inset-0 flex items-center justify-center min-w-[200px]">
              <span className="text-white font-bold tracking-widest text-sm z-10 uppercase mix-blend-overlay">Transmitting</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ id, label, type = "text", rows, pattern }: { id: string, label: string, type?: string, rows?: number, pattern?: string }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative space-y-2 group">
      <label 
        htmlFor={id} 
        className={`text-sm font-medium transition-colors duration-300 ${isFocused ? 'text-purple-400' : 'text-slate-400'}`}
      >
        {label}
      </label>
      
      <div className="relative">
        {rows ? (
          <textarea
            id={id}
            name={id}
            required
            rows={rows}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-md p-3 text-white focus:outline-none transition-colors peer resize-none"
          />
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            required
            pattern={pattern}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-md p-3 text-white focus:outline-none transition-colors peer"
          />
        )}
        
        {/* Animated bottom border trace */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "circOut" }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 origin-left rounded-b-md pointer-events-none"
        />
      </div>
    </div>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initialState);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setIsSuccess(true);
    }
  }, [state]);

  return (
    <div className="relative overflow-hidden min-h-[400px]">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form 
            key="form"
            action={formAction} 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-4 rounded-md">
                {state.error}
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              <InputField id="name" label="Name" />
              <InputField id="email" label="Email" type="email" pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}" />
            </div>
            <InputField id="subject" label="Subject" />
            <InputField id="message" label="Message" rows={5} />
            
            <SubmitButton />
          </motion.form>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4"
          >
            <motion.div
              initial={{ rotate: -90, pathLength: 0 }}
              animate={{ rotate: 0, pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4"
            >
              <CheckCircle2 size={48} className="text-emerald-400" />
            </motion.div>
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Message Secured
            </h3>
            <p className="text-slate-400">
              Your transmission has been received. I will process it and respond shortly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
