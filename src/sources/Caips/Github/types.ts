/** GitHub REST directory listing row for the CAIPs proposals folder. */
export type CaipsGithubContentsEntry = {
	name: string
	type: string
	download_url?: string | null
}

export type CaipsGithubContents = CaipsGithubContentsEntry[]
