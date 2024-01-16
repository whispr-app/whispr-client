import { writable, type Writable } from 'svelte/store';
import { OpCode } from './gatewayTypes';
import { libWhispr } from './libWhispr';

export class Gateway {
	public socket: WebSocket | null = null;
	public open: boolean = false;
	public stream: MessageEvent[] = [];
	public streamWritable: Writable<MessageEvent[]> = writable(this.stream);
	private heartbeatInterval: NodeJS.Timeout | null = null;
	constructor() {
		this.establishConnection();
	}
	public establishConnection = () => {
		this.socket = new WebSocket(libWhispr.constructWsUrl(`gateway/${libWhispr.authStore?.token}`));

		this.socket.onopen = () => {
			this.open = true;
			console.log('ws connected');
		};

		this.socket.onclose = () => {
			this.open = false;
			console.log('ws closed');
		};

		this.socket.onmessage = async (msg) => {
			if (!this.socket) return;

			this.stream.unshift(msg);
			this.streamWritable.set(this.stream);

			console.log(msg);

			const { op, t, d, ts } = JSON.parse(msg.data);

			console.log(op, t, d, ts);

			switch (op) {
				case OpCode.Hello: {
					if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
					this.heartbeatInterval = setInterval(() => {
						if (!this.open && this.heartbeatInterval) return clearInterval(this.heartbeatInterval);
						if (!this.socket) return;
						this.socket.send(
							JSON.stringify({
								op: OpCode.Heartbeat,
								ts: Date.now()
							})
						);
					}, d.heartbeat_interval);
					break;
				}
				case OpCode.Dispatch: {
					break;
				}
			}
		};
	};
}

export const gateway = new Gateway();
