import { createClient } from './client';
import { RealtimePayload } from '@/types/session';

export type BroadcastCallback = (payload: RealtimePayload) => void;

/**
 * Subscribe to a reading session channel for realtime sync.
 * Both Child View and Parent View subscribe to the same channel.
 */
export function subscribeToSession(
  sessionId: string,
  onEvent: BroadcastCallback
) {
  const supabase = createClient();
  const channelName = `realtime:reading_session_${sessionId}`;

  const channel = supabase
    .channel(channelName, {
      config: { broadcast: { self: false } },
    })
    .on('broadcast', { event: '*' }, (msg) => {
      const payload = msg as unknown as { event: string; payload: unknown };
      onEvent(payload as RealtimePayload);
    })
    .subscribe();

  return channel;
}

/**
 * Broadcast an event to the session channel.
 */
export async function broadcastEvent(
  sessionId: string,
  payload: RealtimePayload
) {
  const supabase = createClient();
  const channelName = `realtime:reading_session_${sessionId}`;

  await supabase.channel(channelName).send({
    type: 'broadcast',
    event: payload.event,
    payload: payload.payload,
  });
}

/**
 * Unsubscribe and remove a channel.
 */
export async function unsubscribeFromSession(sessionId: string) {
  const supabase = createClient();
  const channelName = `realtime:reading_session_${sessionId}`;
  await supabase.removeChannel(supabase.channel(channelName));
}
