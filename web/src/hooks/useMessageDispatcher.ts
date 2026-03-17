import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dispatchDueMessages } from '@/services/messages.service';

const DISPATCH_INTERVAL_MS = 60_000; // 1 minuto

/**
 * Dispatcher client-side de mensagens agendadas.
 *
 * Estratégia:
 * 1. Executa imediatamente ao montar (cobre o tempo em que o app ficou fechado).
 * 2. Repete a cada 60 segundos enquanto o usuário está logado.
 *
 * Registrado no AppShell (roda enquanto o app está aberto).
 */
export const useMessageDispatcher = (): void => {
  const { user } = useAuth();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) return;

    const dispatch = (): void => {
      dispatchDueMessages(user.uid)
        .then((count) => {
          if (count > 0) console.log(`[Dispatcher] ${count} mensagem(ns) despachada(s).`);
        })
        .catch((err) => console.error('[Dispatcher] Erro:', err));
    };

    dispatch(); // execução imediata
    intervalRef.current = setInterval(dispatch, DISPATCH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user]);
};
