// Constants
export enum SnapchainReactionType {
	Like = 1,
	Recast = 2,
}

export enum SnapchainUserDataType {
	Pfp = 'USER_DATA_TYPE_PFP',
	Display = 'USER_DATA_TYPE_DISPLAY',
	Bio = 'USER_DATA_TYPE_BIO',
	Url = 'USER_DATA_TYPE_URL',
	Username = 'USER_DATA_TYPE_USERNAME',
	PrimaryAddressEthereum = 'USER_DATA_PRIMARY_ADDRESS_ETHEREUM',
}

/** Numeric `userDataBody.type` values accepted by Snapchain `/v1/userDataByFid`. */
export const snapchainUserDataTypeByNumber = {
	1: SnapchainUserDataType.Pfp,
	2: SnapchainUserDataType.Display,
	3: SnapchainUserDataType.Bio,
	5: SnapchainUserDataType.Url,
	6: SnapchainUserDataType.Username,
	11: SnapchainUserDataType.PrimaryAddressEthereum,
} as const
