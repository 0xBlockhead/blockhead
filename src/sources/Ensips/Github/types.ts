/** GitHub REST directory listing row for the ENSIPs proposals folder. */
export type EnsipsGithubContentsEntry = {
	name: string
	type: string
	download_url?: string | null
}

export type EnsipsGithubContents = EnsipsGithubContentsEntry[]
