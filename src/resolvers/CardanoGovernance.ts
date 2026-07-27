import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { CardanoGovernanceAction } from '$/sources/_shared/interfaces/CardanoGovernance/types.ts'


const cardanoGovernanceCredentialId = (
	credential: {
		keyHash: string
	} | {
		scriptHash: string
	}
) => (
	'keyHash' in credential ?
		`key:${credential.keyHash}`
	:
		`script:${credential.scriptHash}`
)

export const cardanoGovernanceActionFields = (
	action: CardanoGovernanceAction,
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	const previousActionFields = (previousAction: {
		txId: string
		govActionIx: number
	} | null) => (
		previousAction == null ?
			{}
		:
			{
				$previousAction: {
					$network: network,
					proposalTxHash: previousAction.txId,
					proposalIndex: previousAction.govActionIx,
				},
			}
	)

	switch (action.tag) {
		case 'ParameterChange': {
			const [previousAction, _parameters, policyHash] = action.contents
			return {
				...previousActionFields(previousAction),
				...(policyHash != null && {
					policyHash,
				}),
			}
		}
		case 'HardForkInitiation': {
			const [previousAction, protocolVersion] = action.contents
			return {
				...previousActionFields(previousAction),
				hardForkMajor: protocolVersion.major,
				hardForkMinor: protocolVersion.minor,
			}
		}
		case 'TreasuryWithdrawals': {
			const [withdrawals, policyHash] = action.contents
			return {
				...(policyHash != null && {
					policyHash,
				}),
				treasuryWithdrawals: withdrawals.map(([recipient, lovelace]) => ({
					recipientNetwork: recipient.network,
					recipientCredential: cardanoGovernanceCredentialId(recipient.credential),
					lovelace: BigInt(lovelace),
				})),
			}
		}
		case 'NoConfidence':
			return previousActionFields(action.contents)
		case 'UpdateCommittee': {
			const [previousAction, removals, additions, quorum] = action.contents
			return {
				...previousActionFields(previousAction),
				committeeRemovedCredentials: removals.map(cardanoGovernanceCredentialId),
				committeeAdditions: Object.entries(additions).map(([credential, expirationEpoch]) => ({
					credential,
					expirationEpoch,
				})),
				committeeQuorumNumerator: quorum.numerator,
				committeeQuorumDenominator: quorum.denominator,
			}
		}
		case 'NewConstitution': {
			const [previousAction, constitution] = action.contents
			return {
				...previousActionFields(previousAction),
				constitutionAnchorUrl: constitution.anchor.url,
				constitutionAnchorHash: constitution.anchor.dataHash,
				...(constitution.script != null && {
					constitutionScript: constitution.script,
				}),
			}
		}
		case 'InfoAction':
			return {}
	}
}
