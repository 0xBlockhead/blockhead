import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { gitlabHttpEndpoints } from '$/sources/_shared/hosts/Gitlab/Http/constants.ts'

export const bitcoinCashChipsBindings = [
	{
		provider: SourceProvider.BitcoinCashChips,
		source: Source.BitcoinCashChips_Gitlab,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'gitlab:23431309@master:',
		},
		endpoints: gitlabHttpEndpoints,
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.GitObject,
		operationGroups: [
			SourceOperationGroup.GithubRepositoryContents,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
