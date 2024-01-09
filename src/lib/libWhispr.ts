import * as openpgp from 'openpgp';

export type LibWhisprOptions = {
	version: string;
	secure: boolean;
};

export type AuthStore = {
	token: string;
	userId: string;
};

export class LibWhispr {
	private connectionUrl: string;
	private options: LibWhisprOptions;
	private authStore: AuthStore | null = null;

	constructor(connectionUrl: string, options: LibWhisprOptions) {
		this.connectionUrl = connectionUrl;
		this.options = options;
	}

	private constructUrl = (path: string) => {
		return `http${this.options.secure ? 's' : ''}://${this.connectionUrl}/${
			this.options.version
		}/${path}`;
	};

	public updateConnectionUrl = (connectionUrl: string) => {
		this.connectionUrl = connectionUrl;
	};

	public register = async (password: string, nickname: string) => {
		const response = await fetch(this.constructUrl('users/register'), {
			method: 'POST',
			body: JSON.stringify({
				password,
				nickname
			})
		});

		const { token, id } = await response.json();

		this.authStore = {
			token,
			userId: id
		};
	};
}

export const libWhispr = new LibWhispr('localhost:28980', {
	version: 'v1',
	secure: false
});
