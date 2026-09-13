// Generated from APP.ts.

import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchBridgeRouteStepIndex } from '$/params/bridgeRouteStepIndex.ts'
import { match as matchBridgeTransferEventKind } from '$/params/bridgeTransferEventKind.ts'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchEvmAddressOrStringSegment } from '$/params/evmAddressOrStringSegment.ts'
import { match as matchEvmTopicHash } from '$/params/evmTopicHash.ts'
import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import {
	match as matchEvmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment,
} from '$/params/evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment.ts'
import { match as matchFarcasterFid } from '$/params/farcasterFid.ts'
import { match as matchInteger } from '$/params/integer.ts'
import { match as matchIpfsNamespace } from '$/params/ipfsNamespace.ts'
import { match as matchIso4217 } from '$/params/iso4217.ts'
import { match as matchMarketVenueId } from '$/params/marketVenueId.ts'
import { match as matchNativeCurrencySlugOrEvmAddress } from '$/params/nativeCurrencySlugOrEvmAddress.ts'
import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { match as matchNetworkCaip2OrNetworkSlug } from '$/params/networkCaip2OrNetworkSlug.ts'
import { match as matchNetworkSlug } from '$/params/networkSlug.ts'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import {
	match as matchNonNegativeIntegerOrSolanaPubkeyOrStringSegment,
} from '$/params/nonNegativeIntegerOrSolanaPubkeyOrStringSegment.ts'
import { match as matchNonNegativeNumber } from '$/params/nonNegativeNumber.ts'
import { match as matchProposalKindSlug } from '$/params/proposalKindSlug.ts'
import { match as matchProposalRef } from '$/params/proposalRef.ts'
import { match as matchRssItemIdentityKind } from '$/params/rssItemIdentityKind.ts'
import { match as matchSpecificationRealmSlug } from '$/params/specificationRealmSlug.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import {
	match as matchStringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey,
} from '$/params/stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey.ts'
import { match as matchUserOperationHash } from '$/params/userOperationHash.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { match as matchZeroExHexOrStringSegmentOrUtxoTxId } from '$/params/zeroExHexOrStringSegmentOrUtxoTxId.ts'

export const matchE2eRouteParam = (matcher: string, value: string) => {
	switch (matcher) {
		case 'absoluteUrl': return matchAbsoluteUrl(value)
		case 'stringSegment': return matchStringSegment(value)
		case 'nonNegativeInteger': return matchNonNegativeInteger(value)
		case 'zeroExHex': return matchZeroExHex(value)
		case 'evmAddress': return matchEvmAddress(value)
		case 'iso4217': return matchIso4217(value)
		case 'marketVenueId': return matchMarketVenueId(value)
		case 'eip155ChainId': return matchEip155ChainId(value)
		case 'nativeCurrencySlugOrEvmAddress': return matchNativeCurrencySlugOrEvmAddress(value)
		case 'nonNegativeBigInt': return matchNonNegativeBigInt(value)
		case 'ipfsNamespace': return matchIpfsNamespace(value)
		case 'networkCaip2OrNetworkSlug': return matchNetworkCaip2OrNetworkSlug(value)
		case 'stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey': return matchStringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey(value)
		case 'evmTxHash': return matchEvmTxHash(value)
		case 'networkCaip2': return matchNetworkCaip2(value)
		case 'zeroExHexOrStringSegmentOrUtxoTxId': return matchZeroExHexOrStringSegmentOrUtxoTxId(value)
		case 'networkSlug': return matchNetworkSlug(value)
		case 'evmAddressOrStringSegment': return matchEvmAddressOrStringSegment(value)
		case 'evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment': return matchEvmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment(value)
		case 'integer': return matchInteger(value)
		case 'userOperationHash': return matchUserOperationHash(value)
		case 'nonNegativeIntegerOrSolanaPubkeyOrStringSegment': return matchNonNegativeIntegerOrSolanaPubkeyOrStringSegment(value)
		case 'evmTopicHash': return matchEvmTopicHash(value)
		case 'specificationRealmSlug': return matchSpecificationRealmSlug(value)
		case 'proposalKindSlug': return matchProposalKindSlug(value)
		case 'proposalRef': return matchProposalRef(value)
		case 'farcasterFid': return matchFarcasterFid(value)
		case 'rssItemIdentityKind': return matchRssItemIdentityKind(value)
		case 'nonNegativeNumber': return matchNonNegativeNumber(value)
		case 'bridgeRouteStepIndex': return matchBridgeRouteStepIndex(value)
		case 'bridgeTransferEventKind': return matchBridgeTransferEventKind(value)
		default: throw new Error(`Missing generated route matcher ${matcher}`)
	}
}

export type E2eRouteFixtureMapping = {
	id: string
	projectionEntity?: string
	probeCaseId?: string
	probeAtomPrefixes: readonly string[]
	probeCases: readonly (readonly (readonly [prefixIndex: number, caseNumber: string, fields: readonly string[]])[])[]
	projectionPath?: readonly [string, ...string[]]
	boundaryLiveOptional?: true
}

export type E2eRouteFixtureMetadata = {
	routeId: string
	parameterEncodingByName?: Readonly<Record<string, 'Opaque' | 'Path'>>
	mappings: readonly E2eRouteFixtureMapping[]
	boundaryLiveOptional?: true
}

export const e2eRouteFixtureMetadataByNodeId = {
	'/(agents)/agents/a2a/card/[agentCardUrl]': {
		routeId: '/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]',
		parameterEncodingByName: {
			agentCardUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'A2aAgentCard.AgentCardUrl',
				probeAtomPrefixes: ['/agents/a2a/card/[agentCardUrl]:A2aAgentCard.AgentCardUrl'],
				probeCases: [[[0, '1', ['agentCardUrl']]]],
			},
		],
	},
	'/(agents)/agents/a2a/card/[agentCardUrl]/service/[protocolBinding]/[endpointUrl]': {
		routeId: '/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/service/[protocolBinding=stringSegment]/[endpointUrl=absoluteUrl]',
		parameterEncodingByName: {
			agentCardUrl: 'Opaque',
			endpointUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'A2aAgentService.CardProtocolBindingEndpointUrl',
				probeAtomPrefixes: ['/agents/a2a/card/[agentCardUrl]/service/[protocolBinding]/[endpointUrl]:A2aAgentService.CardProtocolBindingEndpointUrl'],
				probeCases: [[[0, '1', ['protocolBinding', 'endpointUrl', 'agentCardUrl']]]],
			},
		],
	},
	'/(agents)/agents/a2a/card/[agentCardUrl]/service/[protocolBinding]/[endpointUrl]/observations/[timestampMs]/[source]': {
		routeId: '/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/service/[protocolBinding=stringSegment]/[endpointUrl=absoluteUrl]/(a2aAgentService)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			agentCardUrl: 'Opaque',
			endpointUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'A2aAgentService_Timestamp.ServiceTimestampMsSource',
				probeAtomPrefixes: ['/agents/a2a/card/[agentCardUrl]/service/[protocolBinding]/[endpointUrl]/observations/[timestampMs]/[source]:A2aAgentService_Timestamp.ServiceTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'protocolBinding', 'endpointUrl', 'agentCardUrl']]]],
			},
		],
	},
	'/(agents)/agents/a2a/card/[agentCardUrl]/service/[protocolBinding]/[endpointUrl]/task/[providerTaskId]': {
		routeId: '/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/service/[protocolBinding=stringSegment]/[endpointUrl=absoluteUrl]/(a2aAgentService)/task/[providerTaskId=stringSegment]',
		parameterEncodingByName: {
			agentCardUrl: 'Opaque',
			endpointUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'A2aTask.ServiceProviderTaskId',
				probeAtomPrefixes: ['/agents/a2a/card/[agentCardUrl]/service/[protocolBinding]/[endpointUrl]/task/[providerTaskId]:A2aTask.ServiceProviderTaskId'],
				probeCases: [[[0, '1', ['providerTaskId', 'protocolBinding', 'endpointUrl', 'agentCardUrl']]]],
			},
		],
	},
	'/(agents)/agents/a2a/card/[agentCardUrl]/snapshot/[contentHashAlgorithm]/[contentHash]': {
		routeId: '/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/snapshot/[contentHashAlgorithm=stringSegment]/[contentHash=zeroExHex]',
		parameterEncodingByName: {
			agentCardUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'A2aAgentCard_Snapshot.CardContentHash',
				probeAtomPrefixes: ['/agents/a2a/card/[agentCardUrl]/snapshot/[contentHashAlgorithm]/[contentHash]:A2aAgentCard_Snapshot.CardContentHash'],
				probeCases: [[[0, '1', ['contentHashAlgorithm', 'contentHash', 'agentCardUrl']]]],
			},
		],
	},
	'/(agents)/agents/a2a/card/[agentCardUrl]/snapshot/[contentHashAlgorithm]/[contentHash]/interface/[protocolBinding]/[url]': {
		routeId: '/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/snapshot/[contentHashAlgorithm=stringSegment]/[contentHash=zeroExHex]/(a2aAgentCardSnapshot)/interface/[protocolBinding=stringSegment]/[url=absoluteUrl]',
		parameterEncodingByName: {
			agentCardUrl: 'Opaque',
			url: 'Opaque',
		},
		mappings: [
			{
				id: 'A2aAgentInterface.CardSnapshotProtocolBindingUrl',
				probeAtomPrefixes: ['/agents/a2a/card/[agentCardUrl]/snapshot/[contentHashAlgorithm]/[contentHash]/interface/[protocolBinding]/[url]:A2aAgentInterface.CardSnapshotProtocolBindingUrl'],
				probeCases: [[[0, '1', ['protocolBinding', 'url', 'contentHashAlgorithm', 'contentHash', 'agentCardUrl']]]],
			},
		],
	},
	'/(agents)/agents/a2a/card/[agentCardUrl]/snapshot/[contentHashAlgorithm]/[contentHash]/skill/[skillId]': {
		routeId: '/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/snapshot/[contentHashAlgorithm=stringSegment]/[contentHash=zeroExHex]/(a2aAgentCardSnapshot)/skill/[skillId=stringSegment]',
		parameterEncodingByName: {
			agentCardUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'A2aAgentSkill.CardSnapshotSkillId',
				probeAtomPrefixes: ['/agents/a2a/card/[agentCardUrl]/snapshot/[contentHashAlgorithm]/[contentHash]/skill/[skillId]:A2aAgentSkill.CardSnapshotSkillId'],
				probeCases: [[[0, '1', ['skillId', 'contentHashAlgorithm', 'contentHash', 'agentCardUrl']]]],
			},
		],
	},
	'/(agents)/agents/a2a/task/[taskId]': {
		routeId: '/(agents)/agents/a2a/task/[taskId=stringSegment]',
		mappings: [
			{
				id: 'A2aTask.TaskId',
				probeAtomPrefixes: ['/agents/a2a/task/[taskId]:A2aTask.TaskId'],
				probeCases: [[[0, '1', ['taskId']]]],
			},
		],
	},
	'/(agents)/agents/a2a/task/[taskId]/artifact/[artifactId]': {
		routeId: '/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/artifact/[artifactId=stringSegment]',
		mappings: [
			{
				id: 'A2aArtifact.TaskArtifactId',
				probeAtomPrefixes: ['/agents/a2a/task/[taskId]/artifact/[artifactId]:A2aArtifact.TaskArtifactId'],
				probeCases: [[[0, '1', ['artifactId', 'taskId']]]],
			},
		],
	},
	'/(agents)/agents/a2a/task/[taskId]/artifact/[artifactId]/part/[partIndex]': {
		routeId: '/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/artifact/[artifactId=stringSegment]/(a2aArtifact)/part/[partIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'A2aMessagePart.ArtifactPartIndex',
				probeAtomPrefixes: ['/agents/a2a/task/[taskId]/artifact/[artifactId]/part/[partIndex]:A2aMessagePart.ArtifactPartIndex'],
				probeCases: [[[0, '1', ['partIndex', 'artifactId', 'taskId']]]],
			},
		],
	},
	'/(agents)/agents/a2a/task/[taskId]/event/[sequence]': {
		routeId: '/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/event/[sequence=nonNegativeInteger]',
		mappings: [
			{
				id: 'A2aTaskEvent.TaskSequence',
				probeAtomPrefixes: ['/agents/a2a/task/[taskId]/event/[sequence]:A2aTaskEvent.TaskSequence'],
				probeCases: [[[0, '1', ['sequence', 'taskId']]]],
			},
		],
	},
	'/(agents)/agents/a2a/task/[taskId]/message/[messageId]': {
		routeId: '/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/message/[messageId=stringSegment]',
		mappings: [
			{
				id: 'A2aMessage.TaskMessageId',
				probeAtomPrefixes: ['/agents/a2a/task/[taskId]/message/[messageId]:A2aMessage.TaskMessageId'],
				probeCases: [[[0, '1', ['messageId', 'taskId']]]],
			},
		],
	},
	'/(agents)/agents/a2a/task/[taskId]/message/[messageId]/part/[partIndex]': {
		routeId: '/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/message/[messageId=stringSegment]/(a2aMessage)/part/[partIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'A2aMessagePart.MessagePartIndex',
				probeAtomPrefixes: ['/agents/a2a/task/[taskId]/message/[messageId]/part/[partIndex]:A2aMessagePart.MessagePartIndex'],
				probeCases: [[[0, '1', ['partIndex', 'messageId', 'taskId']]]],
			},
		],
	},
	'/(agents)/agents/a2a/task/[taskId]/observations/[timestampMs]/[source]': {
		routeId: '/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'A2aTask_Timestamp.TaskTimestampMsSource',
				probeAtomPrefixes: ['/agents/a2a/task/[taskId]/observations/[timestampMs]/[source]:A2aTask_Timestamp.TaskTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'taskId']]]],
			},
		],
	},
	'/(agents)/agents/a2a/task/[taskId]/push-notification/[configId]': {
		routeId: '/(agents)/agents/a2a/task/[taskId=stringSegment]/(a2aTask)/push-notification/[configId=stringSegment]',
		mappings: [
			{
				id: 'A2aPushNotificationConfig.TaskConfigId',
				probeAtomPrefixes: ['/agents/a2a/task/[taskId]/push-notification/[configId]:A2aPushNotificationConfig.TaskConfigId'],
				probeCases: [[[0, '1', ['configId', 'taskId']]]],
			},
		],
	},
	'/(agents)/agents/acp/program/package/[packageName]': {
		routeId: '/(agents)/agents/acp/program/package/[packageName=stringSegment]',
		mappings: [
			{
				id: 'AcpAgentProgram.PackageName',
				probeAtomPrefixes: ['/agents/acp/program/package/[packageName]:AcpAgentProgram.PackageName'],
				probeCases: [[[0, '1', ['packageName']]]],
			},
		],
	},
	'/(agents)/agents/acp/program/registry/[registryAgentId]': {
		routeId: '/(agents)/agents/acp/program/registry/[registryAgentId=stringSegment]',
		mappings: [
			{
				id: 'AcpAgentProgram.RegistryAgentId',
				probeAtomPrefixes: ['/agents/acp/program/registry/[registryAgentId]:AcpAgentProgram.RegistryAgentId'],
				probeCases: [[[0, '1', ['registryAgentId']]]],
			},
		],
	},
	'/(agents)/agents/acp/program/registry/[registryAgentId]/version/[version]': {
		routeId: '/(agents)/agents/acp/program/registry/[registryAgentId=stringSegment]/(acpAgentProgram)/version/[version=stringSegment]',
		mappings: [
			{
				id: 'AcpAgentProgramVersion.ProgramVersion',
				probeAtomPrefixes: ['/agents/acp/program/registry/[registryAgentId]/version/[version]:AcpAgentProgramVersion.ProgramVersion'],
				probeCases: [[[0, '1', ['version', 'registryAgentId']]]],
			},
		],
	},
	'/(agents)/agents/acp/program/repository/[repositoryUrl]': {
		routeId: '/(agents)/agents/acp/program/repository/[repositoryUrl=absoluteUrl]',
		parameterEncodingByName: {
			repositoryUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'AcpAgentProgram.RepositoryUrl',
				probeAtomPrefixes: ['/agents/acp/program/repository/[repositoryUrl]:AcpAgentProgram.RepositoryUrl'],
				probeCases: [[[0, '1', ['repositoryUrl']]]],
			},
		],
	},
	'/(agents)/agents/acp/runtime/[runtimeId]': {
		routeId: '/(agents)/agents/acp/runtime/[runtimeId=stringSegment]',
		mappings: [
			{
				id: 'AcpAgentRuntime.RuntimeId',
				probeAtomPrefixes: ['/agents/acp/runtime/[runtimeId]:AcpAgentRuntime.RuntimeId'],
				probeCases: [[[0, '1', ['runtimeId']]]],
			},
		],
	},
	'/(agents)/agents/acp/runtime/[runtimeId]/observations/[timestampMs]/[source]': {
		routeId: '/(agents)/agents/acp/runtime/[runtimeId=stringSegment]/(acpAgentRuntime)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AcpAgentRuntime_Timestamp.RuntimeTimestampMsSource',
				probeAtomPrefixes: ['/agents/acp/runtime/[runtimeId]/observations/[timestampMs]/[source]:AcpAgentRuntime_Timestamp.RuntimeTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'runtimeId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]',
		mappings: [
			{
				id: 'AcpSession.SessionId',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]:AcpSession.SessionId'],
				probeCases: [[[0, '1', ['sessionId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]/file-operation/[operationId]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/file-operation/[operationId=stringSegment]',
		mappings: [
			{
				id: 'AcpFileOperation.SessionOperationId',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]/file-operation/[operationId]:AcpFileOperation.SessionOperationId'],
				probeCases: [[[0, '1', ['operationId', 'sessionId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]/message/[messageId]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/message/[messageId=stringSegment]',
		mappings: [
			{
				id: 'AcpMessage.SessionMessageId',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]/message/[messageId]:AcpMessage.SessionMessageId'],
				probeCases: [[[0, '1', ['messageId', 'sessionId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]/message/[messageId]/part/[partIndex]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/message/[messageId=stringSegment]/(acpMessage)/part/[partIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'AcpMessagePart.MessagePartIndex',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]/message/[messageId]/part/[partIndex]:AcpMessagePart.MessagePartIndex'],
				probeCases: [[[0, '1', ['partIndex', 'messageId', 'sessionId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]/permission-request/[requestId]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/permission-request/[requestId=stringSegment]',
		mappings: [
			{
				id: 'AcpPermissionRequest.SessionRequestId',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]/permission-request/[requestId]:AcpPermissionRequest.SessionRequestId'],
				probeCases: [[[0, '1', ['requestId', 'sessionId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]/terminal/[terminalId]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/terminal/[terminalId=stringSegment]',
		mappings: [
			{
				id: 'AcpTerminal.SessionTerminalId',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]/terminal/[terminalId]:AcpTerminal.SessionTerminalId'],
				probeCases: [[[0, '1', ['terminalId', 'sessionId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]/terminal/[terminalId]/observations/[timestampMs]/[source]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/terminal/[terminalId=stringSegment]/(acpTerminal)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AcpTerminal_Timestamp.TerminalTimestampMsSource',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]/terminal/[terminalId]/observations/[timestampMs]/[source]:AcpTerminal_Timestamp.TerminalTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'terminalId', 'sessionId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]/turn/[turnId]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/turn/[turnId=stringSegment]',
		mappings: [
			{
				id: 'AcpPromptTurn.SessionTurnId',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]/turn/[turnId]:AcpPromptTurn.SessionTurnId'],
				probeCases: [[[0, '1', ['turnId', 'sessionId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]/turn/[turnId]/tool-call/[toolCallId]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/turn/[turnId=stringSegment]/(acpPromptTurn)/tool-call/[toolCallId=stringSegment]',
		mappings: [
			{
				id: 'AcpToolCall.PromptTurnToolCallId',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]/turn/[turnId]/tool-call/[toolCallId]:AcpToolCall.PromptTurnToolCallId'],
				probeCases: [[[0, '1', ['toolCallId', 'turnId', 'sessionId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]/turn/[turnId]/tool-call/[toolCallId]/observations/[timestampMs]/[source]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/turn/[turnId=stringSegment]/(acpPromptTurn)/tool-call/[toolCallId=stringSegment]/(acpToolCall)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AcpToolCall_Timestamp.ToolCallTimestampMsSource',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]/turn/[turnId]/tool-call/[toolCallId]/observations/[timestampMs]/[source]:AcpToolCall_Timestamp.ToolCallTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'toolCallId', 'turnId', 'sessionId']]]],
			},
		],
	},
	'/(agents)/agents/acp/session/[sessionId]/update/[sequence]': {
		routeId: '/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/update/[sequence=nonNegativeInteger]',
		mappings: [
			{
				id: 'AcpSessionUpdate.SessionSequence',
				probeAtomPrefixes: ['/agents/acp/session/[sessionId]/update/[sequence]:AcpSessionUpdate.SessionSequence'],
				probeCases: [[[0, '1', ['sequence', 'sessionId']]]],
			},
		],
	},
	'/(agents)/agents/eip-8004/[namespace]/[chainId]/registry/[identityRegistry]/agent/[agentId]': {
		routeId: '/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]',
		mappings: [
			{
				id: 'Eip8004AgentRegistration.NamespaceChainIdIdentityRegistryAgentId',
				probeAtomPrefixes: ['/agents/eip-8004/[namespace]/[chainId]/registry/[identityRegistry]/agent/[agentId]:Eip8004AgentRegistration.NamespaceChainIdIdentityRegistryAgentId'],
				probeCases: [[[0, '1', ['namespace', 'chainId', 'identityRegistry', 'agentId']]]],
			},
		],
	},
	'/(agents)/agents/eip-8004/[namespace]/[chainId]/registry/[identityRegistry]/agent/[agentId]/feedback/[clientAddress]/[feedbackIndex]/[timestampMs]/[source]': {
		routeId: '/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]/(eip8004AgentRegistration)/feedback/[clientAddress=evmAddress]/[feedbackIndex=nonNegativeInteger]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Eip8004ReputationFeedback_Timestamp.RegistrationClientAddressFeedbackIndexTimestampMsSource',
				probeAtomPrefixes: ['/agents/eip-8004/[namespace]/[chainId]/registry/[identityRegistry]/agent/[agentId]/feedback/[clientAddress]/[feedbackIndex]/[timestampMs]/[source]:Eip8004ReputationFeedback_Timestamp.RegistrationClientAddressFeedbackIndexTimestampMsSource'],
				probeCases: [[[0, '1', ['clientAddress', 'feedbackIndex', 'timestampMs', 'source', 'namespace', 'chainId', 'identityRegistry', 'agentId']]]],
			},
		],
	},
	'/(agents)/agents/eip-8004/[namespace]/[chainId]/registry/[identityRegistry]/agent/[agentId]/file/[fileUrl]': {
		routeId: '/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]/(eip8004AgentRegistration)/file/[fileUrl=absoluteUrl]',
		parameterEncodingByName: {
			fileUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'Eip8004AgentRegistrationFile.RegistrationFileUrl',
				probeAtomPrefixes: ['/agents/eip-8004/[namespace]/[chainId]/registry/[identityRegistry]/agent/[agentId]/file/[fileUrl]:Eip8004AgentRegistrationFile.RegistrationFileUrl'],
				probeCases: [[[0, '1', ['fileUrl', 'namespace', 'chainId', 'identityRegistry', 'agentId']]]],
			},
		],
	},
	'/(agents)/agents/eip-8004/[namespace]/[chainId]/registry/[identityRegistry]/agent/[agentId]/file/[fileUrl]/service-endpoint/[endpointKind]/[endpointUrl]': {
		routeId: '/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]/(eip8004AgentRegistration)/file/[fileUrl=absoluteUrl]/(eip8004AgentRegistrationFile)/service-endpoint/[endpointKind=stringSegment]/[endpointUrl=absoluteUrl]',
		parameterEncodingByName: {
			fileUrl: 'Opaque',
			endpointUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'Eip8004AgentServiceEndpoint.RegistrationFileEndpointKindEndpointUrl',
				probeAtomPrefixes: ['/agents/eip-8004/[namespace]/[chainId]/registry/[identityRegistry]/agent/[agentId]/file/[fileUrl]/service-endpoint/[endpointKind]/[endpointUrl]:Eip8004AgentServiceEndpoint.RegistrationFileEndpointKindEndpointUrl'],
				probeCases: [[[0, '1', ['endpointKind', 'endpointUrl', 'fileUrl', 'namespace', 'chainId', 'identityRegistry', 'agentId']]]],
			},
		],
	},
	'/(agents)/agents/eip-8004/[namespace]/[chainId]/registry/[identityRegistry]/agent/[agentId]/observations/[timestampMs]/[source]': {
		routeId: '/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]/(eip8004AgentRegistration)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Eip8004AgentRegistration_Timestamp.RegistrationTimestampMsSource',
				probeAtomPrefixes: ['/agents/eip-8004/[namespace]/[chainId]/registry/[identityRegistry]/agent/[agentId]/observations/[timestampMs]/[source]:Eip8004AgentRegistration_Timestamp.RegistrationTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'namespace', 'chainId', 'identityRegistry', 'agentId']]]],
			},
		],
	},
	'/(agents)/agents/eip-8004/endpoint-verification/[endpointUrl]/observations/[timestampMs]/[source]': {
		routeId: '/(agents)/agents/eip-8004/endpoint-verification/[endpointUrl=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Eip8004EndpointDomainVerification_Timestamp.EndpointUrlTimestampMsSource',
				probeAtomPrefixes: ['/agents/eip-8004/endpoint-verification/[endpointUrl]/observations/[timestampMs]/[source]:Eip8004EndpointDomainVerification_Timestamp.EndpointUrlTimestampMsSource'],
				probeCases: [[[0, '1', ['endpointUrl', 'timestampMs', 'source']]]],
			},
		],
	},
	'/(agents)/agents/eip-8004/validation/[requestHashAlgorithm]/[requestHash]/observations/[timestampMs]/[source]': {
		routeId: '/(agents)/agents/eip-8004/validation/[requestHashAlgorithm=stringSegment]/[requestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Eip8004Validation_Timestamp.RequestHashAlgorithmRequestHashTimestampMsSource',
				probeAtomPrefixes: ['/agents/eip-8004/validation/[requestHashAlgorithm]/[requestHash]/observations/[timestampMs]/[source]:Eip8004Validation_Timestamp.RequestHashAlgorithmRequestHashTimestampMsSource'],
				probeCases: [[[0, '1', ['requestHashAlgorithm', 'requestHash', 'timestampMs', 'source']]]],
			},
		],
	},
	'/(ai)/ai/artifact/arweave/[arweaveId]': {
		routeId: '/(ai)/ai/artifact/arweave/[arweaveId=stringSegment]',
		mappings: [
			{
				id: 'AiArtifact.ArweaveId',
				probeAtomPrefixes: ['/ai/artifact/arweave/[arweaveId]:AiArtifact.ArweaveId'],
				probeCases: [[[0, '1', ['arweaveId']]]],
			},
		],
	},
	'/(ai)/ai/artifact/digest/[digestAlgorithm]/[digest]': {
		routeId: '/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]',
		mappings: [
			{
				id: 'AiArtifact.Digest',
				probeAtomPrefixes: ['/ai/artifact/digest/[digestAlgorithm]/[digest]:AiArtifact.Digest'],
				probeCases: [[[0, '1', ['digestAlgorithm', 'digest']]]],
			},
		],
	},
	'/(ai)/ai/artifact/digest/[digestAlgorithm]/[digest]/acp-program-version': {
		routeId: '/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/acp-program-version',
		mappings: [
			{
				id: 'AcpAgentProgramVersion.Artifact',
				probeAtomPrefixes: ['/ai/artifact/digest/[digestAlgorithm]/[digest]/acp-program-version:AcpAgentProgramVersion.Artifact'],
				probeCases: [[[0, '1', ['digestAlgorithm', 'digest']]]],
			},
		],
	},
	'/(ai)/ai/artifact/digest/[digestAlgorithm]/[digest]/attestation/[attestationKind]/log/[logEntryId]': {
		routeId: '/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/attestation/[attestationKind=stringSegment]/log/[logEntryId=stringSegment]',
		mappings: [
			{
				id: 'AiArtifactAttestation.ArtifactAttestationKindLogEntryId',
				probeAtomPrefixes: ['/ai/artifact/digest/[digestAlgorithm]/[digest]/attestation/[attestationKind]/log/[logEntryId]:AiArtifactAttestation.ArtifactAttestationKindLogEntryId'],
				probeCases: [[[0, '1', ['attestationKind', 'logEntryId', 'digestAlgorithm', 'digest']]]],
			},
		],
	},
	'/(ai)/ai/artifact/digest/[digestAlgorithm]/[digest]/attestation/[attestationKind]/signature/[signatureHashAlgorithm]/[signatureHash]': {
		routeId: '/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/attestation/[attestationKind=stringSegment]/signature/[signatureHashAlgorithm=stringSegment]/[signatureHash=stringSegment]',
		mappings: [
			{
				id: 'AiArtifactAttestation.ArtifactAttestationKindSignatureHashAlgorithmSignatureHash',
				probeAtomPrefixes: ['/ai/artifact/digest/[digestAlgorithm]/[digest]/attestation/[attestationKind]/signature/[signatureHashAlgorithm]/[signatureHash]:AiArtifactAttestation.ArtifactAttestationKindSignatureHashAlgorithmSignatureHash'],
				probeCases: [[[0, '1', ['attestationKind', 'signatureHashAlgorithm', 'signatureHash', 'digestAlgorithm', 'digest']]]],
			},
		],
	},
	'/(ai)/ai/artifact/digest/[digestAlgorithm]/[digest]/dataset': {
		routeId: '/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/dataset',
		mappings: [
			{
				id: 'AiDataset.Artifact',
				probeAtomPrefixes: ['/ai/artifact/digest/[digestAlgorithm]/[digest]/dataset:AiDataset.Artifact'],
				probeCases: [[[0, '1', ['digestAlgorithm', 'digest']]]],
			},
		],
	},
	'/(ai)/ai/artifact/digest/[digestAlgorithm]/[digest]/document/[documentKind]': {
		routeId: '/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/document/[documentKind=stringSegment]',
		mappings: [
			{
				id: 'AiDocument.KindArtifact',
				probeAtomPrefixes: ['/ai/artifact/digest/[digestAlgorithm]/[digest]/document/[documentKind]:AiDocument.KindArtifact'],
				probeCases: [[[0, '1', ['documentKind', 'digestAlgorithm', 'digest']]]],
			},
		],
	},
	'/(ai)/ai/artifact/digest/[digestAlgorithm]/[digest]/model-version': {
		routeId: '/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/model-version',
		mappings: [
			{
				id: 'AiModelVersion.Artifact',
				probeAtomPrefixes: ['/ai/artifact/digest/[digestAlgorithm]/[digest]/model-version:AiModelVersion.Artifact'],
				probeCases: [[[0, '1', ['digestAlgorithm', 'digest']]]],
			},
		],
	},
	'/(ai)/ai/artifact/git/[gitObject]': {
		routeId: '/(ai)/ai/artifact/git/[gitObject=stringSegment]',
		mappings: [
			{
				id: 'AiArtifact.GitObject',
				probeAtomPrefixes: ['/ai/artifact/git/[gitObject]:AiArtifact.GitObject'],
				probeCases: [[[0, '1', ['gitObject']]]],
			},
		],
	},
	'/(ai)/ai/artifact/ipfs/[ipfsCid]': {
		routeId: '/(ai)/ai/artifact/ipfs/[ipfsCid=stringSegment]',
		mappings: [
			{
				id: 'AiArtifact.IpfsCid',
				probeAtomPrefixes: ['/ai/artifact/ipfs/[ipfsCid]:AiArtifact.IpfsCid'],
				probeCases: [[[0, '1', ['ipfsCid']]]],
			},
		],
	},
	'/(ai)/ai/artifact/oci/[ociDigest]': {
		routeId: '/(ai)/ai/artifact/oci/[ociDigest=stringSegment]',
		mappings: [
			{
				id: 'AiArtifact.OciDigest',
				probeAtomPrefixes: ['/ai/artifact/oci/[ociDigest]:AiArtifact.OciDigest'],
				probeCases: [[[0, '1', ['ociDigest']]]],
			},
		],
	},
	'/(ai)/ai/benchmark/id/[benchmarkId]': {
		routeId: '/(ai)/ai/benchmark/id/[benchmarkId=stringSegment]',
		mappings: [
			{
				id: 'AiBenchmark.BenchmarkId',
				probeAtomPrefixes: ['/ai/benchmark/id/[benchmarkId]:AiBenchmark.BenchmarkId'],
				probeCases: [[[0, '1', ['benchmarkId']]]],
			},
		],
	},
	'/(ai)/ai/benchmark/source/[source]/[sourceBenchmarkId]': {
		routeId: '/(ai)/ai/benchmark/source/[source=stringSegment]/[sourceBenchmarkId=stringSegment]',
		mappings: [
			{
				id: 'AiBenchmark.SourceSourceBenchmarkId',
				probeAtomPrefixes: ['/ai/benchmark/source/[source]/[sourceBenchmarkId]:AiBenchmark.SourceSourceBenchmarkId'],
				probeCases: [[[0, '1', ['source', 'sourceBenchmarkId']]]],
			},
		],
	},
	'/(ai)/ai/benchmark/uri/[benchmarkUri]': {
		routeId: '/(ai)/ai/benchmark/uri/[benchmarkUri=absoluteUrl]',
		parameterEncodingByName: {
			benchmarkUri: 'Opaque',
		},
		mappings: [
			{
				id: 'AiBenchmark.BenchmarkUri',
				probeAtomPrefixes: ['/ai/benchmark/uri/[benchmarkUri]:AiBenchmark.BenchmarkUri'],
				probeCases: [[[0, '1', ['benchmarkUri']]]],
			},
		],
	},
	'/(ai)/ai/dataset/huggingface/[huggingFaceDatasetId]/[revision]': {
		routeId: '/(ai)/ai/dataset/huggingface/[huggingFaceDatasetId=stringSegment]/[revision=stringSegment]',
		mappings: [
			{
				id: 'AiDataset.HuggingFaceDatasetIdRevision',
				probeAtomPrefixes: ['/ai/dataset/huggingface/[huggingFaceDatasetId]/[revision]:AiDataset.HuggingFaceDatasetIdRevision'],
				probeCases: [[[0, '1', ['huggingFaceDatasetId', 'revision']]]],
			},
		],
	},
	'/(ai)/ai/dataset/source/[source]/[datasetName]/[datasetDigest]': {
		routeId: '/(ai)/ai/dataset/source/[source=stringSegment]/[datasetName=stringSegment]/[datasetDigest=stringSegment]',
		mappings: [
			{
				id: 'AiDataset.SourceDatasetNameDatasetDigest',
				probeAtomPrefixes: ['/ai/dataset/source/[source]/[datasetName]/[datasetDigest]:AiDataset.SourceDatasetNameDatasetDigest'],
				probeCases: [[[0, '1', ['source', 'datasetName', 'datasetDigest']]]],
			},
		],
	},
	'/(ai)/ai/dataset/uri/[datasetUri]': {
		routeId: '/(ai)/ai/dataset/uri/[datasetUri=absoluteUrl]',
		parameterEncodingByName: {
			datasetUri: 'Opaque',
		},
		mappings: [
			{
				id: 'AiDataset.DatasetUri',
				probeAtomPrefixes: ['/ai/dataset/uri/[datasetUri]:AiDataset.DatasetUri'],
				probeCases: [[[0, '1', ['datasetUri']]]],
			},
		],
	},
	'/(ai)/ai/document/[documentKind]/hash/[contentHashAlgorithm]/[contentHash]': {
		routeId: '/(ai)/ai/document/[documentKind=stringSegment]/hash/[contentHashAlgorithm=stringSegment]/[contentHash=zeroExHex]',
		mappings: [
			{
				id: 'AiDocument.KindContentHash',
				probeAtomPrefixes: ['/ai/document/[documentKind]/hash/[contentHashAlgorithm]/[contentHash]:AiDocument.KindContentHash'],
				probeCases: [[[0, '1', ['documentKind', 'contentHashAlgorithm', 'contentHash']]]],
			},
		],
	},
	'/(ai)/ai/document/url/[documentUrl]': {
		routeId: '/(ai)/ai/document/url/[documentUrl=absoluteUrl]',
		parameterEncodingByName: {
			documentUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'AiDocument.DocumentUrl',
				probeAtomPrefixes: ['/ai/document/url/[documentUrl]:AiDocument.DocumentUrl'],
				probeCases: [[[0, '1', ['documentUrl']]]],
			},
		],
	},
	'/(ai)/ai/document/url/[documentUrl]/claim/[extractorId]/[claimPath]': {
		routeId: '/(ai)/ai/document/url/[documentUrl=absoluteUrl]/(aiDocument)/claim/[extractorId=stringSegment]/[claimPath=stringSegment]',
		parameterEncodingByName: {
			documentUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'AiDocumentClaim.DocumentExtractorIdClaimPath',
				probeAtomPrefixes: ['/ai/document/url/[documentUrl]/claim/[extractorId]/[claimPath]:AiDocumentClaim.DocumentExtractorIdClaimPath'],
				probeCases: [[[0, '1', ['extractorId', 'claimPath', 'documentUrl']]]],
			},
		],
	},
	'/(ai)/ai/model-version/huggingface/[huggingFaceRepo]/[revision]': {
		routeId: '/(ai)/ai/model-version/huggingface/[huggingFaceRepo=stringSegment]/[revision=stringSegment]',
		mappings: [
			{
				id: 'AiModelVersion.HuggingFaceRepoRevision',
				probeAtomPrefixes: ['/ai/model-version/huggingface/[huggingFaceRepo]/[revision]:AiModelVersion.HuggingFaceRepoRevision'],
				probeCases: [[[0, '1', ['huggingFaceRepo', 'revision']]]],
			},
		],
	},
	'/(ai)/ai/provider/domain/[domain]': {
		routeId: '/(ai)/ai/provider/domain/[domain=stringSegment]',
		mappings: [
			{
				id: 'AiModelProvider.Domain',
				probeAtomPrefixes: ['/ai/provider/domain/[domain]:AiModelProvider.Domain'],
				probeCases: [[[0, '1', ['domain']]]],
			},
		],
	},
	'/(ai)/ai/provider/id/[providerId]': {
		routeId: '/(ai)/ai/provider/id/[providerId=stringSegment]',
		mappings: [
			{
				id: 'AiModelProvider.ProviderId',
				probeAtomPrefixes: ['/ai/provider/id/[providerId]:AiModelProvider.ProviderId'],
				probeCases: [[[0, '1', ['providerId']]]],
			},
		],
	},
	'/(ai)/ai/provider/id/[providerId]/artifact/[providerArtifactId]': {
		routeId: '/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/artifact/[providerArtifactId=stringSegment]',
		mappings: [
			{
				id: 'AiArtifact.ProviderArtifactId',
				probeAtomPrefixes: ['/ai/provider/id/[providerId]/artifact/[providerArtifactId]:AiArtifact.ProviderArtifactId'],
				probeCases: [[[0, '1', ['providerArtifactId', 'providerId']]]],
			},
		],
	},
	'/(ai)/ai/provider/id/[providerId]/artifact/[providerArtifactId]/mcp-package-version': {
		routeId: '/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/artifact/[providerArtifactId=stringSegment]/(aiArtifact)/mcp-package-version',
		mappings: [
			{
				id: 'McpServerPackageVersion.Artifact',
				probeAtomPrefixes: ['/ai/provider/id/[providerId]/artifact/[providerArtifactId]/mcp-package-version:McpServerPackageVersion.Artifact'],
				probeCases: [[[0, '1', ['providerArtifactId', 'providerId']]]],
			},
		],
	},
	'/(ai)/ai/provider/id/[providerId]/catalog/[catalogKind]/[providerEntryId]': {
		routeId: '/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/catalog/[catalogKind=stringSegment]/[providerEntryId=stringSegment]',
		mappings: [
			{
				id: 'AiProviderCatalogEntry.ProviderCatalogKindProviderEntryId',
				probeAtomPrefixes: ['/ai/provider/id/[providerId]/catalog/[catalogKind]/[providerEntryId]:AiProviderCatalogEntry.ProviderCatalogKindProviderEntryId'],
				probeCases: [[[0, '1', ['catalogKind', 'providerEntryId', 'providerId']]]],
			},
		],
	},
	'/(ai)/ai/provider/id/[providerId]/model/[providerModelId]': {
		routeId: '/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/model/[providerModelId=stringSegment]',
		mappings: [
			{
				id: 'AiModel.ProviderModelId',
				probeAtomPrefixes: ['/ai/provider/id/[providerId]/model/[providerModelId]:AiModel.ProviderModelId'],
				probeCases: [[[0, '1', ['providerModelId', 'providerId']]]],
			},
		],
	},
	'/(ai)/ai/provider/id/[providerId]/model/[providerModelId]/version/[versionId]': {
		routeId: '/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/model/[providerModelId=stringSegment]/(aiModel)/version/[versionId=stringSegment]',
		mappings: [
			{
				id: 'AiModelVersion.ModelVersionId',
				probeAtomPrefixes: ['/ai/provider/id/[providerId]/model/[providerModelId]/version/[versionId]:AiModelVersion.ModelVersionId'],
				probeCases: [[[0, '1', ['versionId', 'providerModelId', 'providerId']]]],
			},
		],
	},
	'/(ai)/ai/provider/id/[providerId]/operation/[operationId]': {
		routeId: '/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/operation/[operationId=stringSegment]',
		mappings: [
			{
				id: 'AiProviderApiOperation.ProviderOperationId',
				probeAtomPrefixes: ['/ai/provider/id/[providerId]/operation/[operationId]:AiProviderApiOperation.ProviderOperationId'],
				probeCases: [[[0, '1', ['operationId', 'providerId']]]],
			},
		],
	},
	'/(arweave)/arweave/resource/[transactionId]': {
		routeId: '/(arweave)/arweave/resource/[transactionId=stringSegment]',
		mappings: [
			{
				id: 'ArweaveResource.TransactionId',
				probeAtomPrefixes: ['/arweave/resource/[transactionId]:ArweaveResource.TransactionId'],
				probeCases: [[[0, '1', ['transactionId']]]],
			},
		],
	},
	'/(arweave)/arweave/resource/[transactionId]/manifest-path/[...path]': {
		routeId: '/(arweave)/arweave/resource/[transactionId=stringSegment]/(arweaveResource)/manifest-path/[...path=stringSegment]',
		mappings: [
			{
				id: 'ArweaveManifestPath.ManifestPath',
				probeAtomPrefixes: ['/arweave/resource/[transactionId]/manifest-path/[...path]:ArweaveManifestPath.ManifestPath'],
				probeCases: [[[0, '1', ['path', 'transactionId']]]],
			},
		],
	},
	'/(arweave)/arweave/resource/[transactionId]/path/[...contentPath]': {
		routeId: '/(arweave)/arweave/resource/[transactionId=stringSegment]/(arweaveResource)/path/[...contentPath=stringSegment]',
		mappings: [
			{
				id: 'ArweaveResource.TransactionIdContentPath',
				probeAtomPrefixes: ['/arweave/resource/[transactionId]/path/[...contentPath]:ArweaveResource.TransactionIdContentPath'],
				probeCases: [[[0, '1', ['transactionId', 'contentPath']]]],
			},
		],
	},
	'/(arweave)/arweave/resource/[transactionId]/path/[...contentPath]/observations/[timestampMs]/[source]': {
		routeId: '/(arweave)/arweave/resource/[transactionId=stringSegment]/(arweaveResource)/path/[...contentPath=stringSegment]/(arweaveResource)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'ArweaveResource_Timestamp.ResourceTimestampMsSource',
				probeAtomPrefixes: ['/arweave/resource/[transactionId]/path/[...contentPath]/observations/[timestampMs]/[source]:ArweaveResource_Timestamp.ResourceTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'transactionId', 'contentPath']]]],
			},
		],
	},
	'/(assets)/(currencies)/currency/[iso4217]': {
		routeId: '/(assets)/(currencies)/currency/[iso4217=iso4217]',
		mappings: [
			{
				id: 'Currency.Iso4217',
				probeAtomPrefixes: ['/currency/[iso4217]:Currency.Iso4217'],
				probeCases: [[[0, '1', ['iso4217']]]],
			},
		],
	},
	'/(assets)/(currencies)/currency/[iso4217]/observations/[timestampMs]': {
		routeId: '/(assets)/(currencies)/currency/[iso4217=iso4217]/(currency)/observations/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'Currency_Timestamp.CurrencyTimestampMs',
				probeAtomPrefixes: ['/currency/[iso4217]/observations/[timestampMs]:Currency_Timestamp.CurrencyTimestampMs'],
				probeCases: [[[0, '1', ['timestampMs', 'iso4217']]]],
			},
		],
	},
	'/(assets)/(marketAssets)/market-asset/[kind]/[assetKey]': {
		routeId: '/(assets)/(marketAssets)/market-asset/[kind=stringSegment]/[assetKey=stringSegment]',
		mappings: [
			{
				id: 'MarketAsset.KindAssetKey',
				probeAtomPrefixes: ['/market-asset/[kind]/[assetKey]:MarketAsset.KindAssetKey'],
				probeCases: [[[0, '1', ['kind', 'assetKey']]]],
			},
		],
	},
	'/(assets)/(marketVenues)/market-venue/[marketVenueId]': {
		routeId: '/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]',
		mappings: [
			{
				id: 'MarketVenue.MarketVenueId',
				probeAtomPrefixes: ['/market-venue/[marketVenueId]:MarketVenue.MarketVenueId'],
				probeCases: [[[0, '1', ['marketVenueId']]]],
			},
		],
	},
	'/(assets)/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]': {
		routeId: '/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]',
		mappings: [
			{
				id: 'CoinBridgeCapability.EvmCoinInstanceEvmCoinInstanceToolKey',
				probeAtomPrefixes: ['/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]:CoinBridgeCapability.EvmCoinInstanceEvmCoinInstanceToolKey'],
				probeCases: [[[0, '1', ['toolKey', 'fromChainId', 'fromCoinInstanceSlug', 'toChainId', 'toCoinInstanceSlug']]]],
			},
		],
	},
	'/(assets)/cctp/allowance/[token]': {
		routeId: '/(assets)/cctp/allowance/[token=stringSegment]',
		mappings: [
			{
				id: 'CctpAllowance.Token',
				probeAtomPrefixes: ['/cctp/allowance/[token]:CctpAllowance.Token'],
				probeCases: [[[0, '1', ['token']]]],
			},
		],
	},
	'/(assets)/coin-instance/[chainId]/[coinInstanceSlug]': {
		routeId: '/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]',
		mappings: [
			{
				id: 'EvmCoinInstance.NetworkType',
				projectionEntity: 'EvmCoinInstance',
				probeAtomPrefixes: ['/coin-instance/[chainId]/[coinInstanceSlug]:EvmCoinInstance.NetworkType'],
				probeCases: [[[0, '1', ['chainId', 'coinInstanceSlug']]]],
				projectionPath: [
					'NativeCurrency',
				],
			},
			{
				id: 'EvmCoinInstance.NetworkTypeContract',
				projectionEntity: 'EvmCoinInstance',
				probeAtomPrefixes: ['/coin-instance/[chainId]/[coinInstanceSlug]:EvmCoinInstance.NetworkTypeContract'],
				probeCases: [[[0, '1', ['coinInstanceSlug', 'chainId']]]],
				projectionPath: [
					'Erc20Token',
				],
			},
		],
	},
	'/(assets)/coin/[coinId]': {
		routeId: '/(assets)/coin/[coinId=stringSegment]',
		mappings: [
			{
				id: 'Coin.CoinId',
				probeAtomPrefixes: ['/coin/[coinId]:Coin.CoinId'],
				probeCases: [[[0, '1', ['coinId']]]],
			},
		],
	},
	'/(assets)/coin/[coinId]/observations/[timestampMs]/[source]': {
		routeId: '/(assets)/coin/[coinId=stringSegment]/(coin)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Coin_Timestamp.CoinTimestampMsSource',
				probeAtomPrefixes: ['/coin/[coinId]/observations/[timestampMs]/[source]:Coin_Timestamp.CoinTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'coinId']]]],
			},
		],
	},
	'/(assets)/pool/[chainId]/[poolId]': {
		routeId: '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]',
		mappings: [
			{
				id: 'LiquidityPool.EvmNetworkId',
				probeAtomPrefixes: ['/pool/[chainId]/[poolId]:LiquidityPool.EvmNetworkId'],
				probeCases: [[[0, '1', ['poolId', 'chainId']]]],
			},
		],
	},
	'/(assets)/pool/[chainId]/[poolId]/amm-observation/[blockSelector]/[sourceRevision]': {
		routeId: '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/amm-observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]',
		mappings: [
			{
				id: 'LiquidityPool_Amm_EvmBlock.PoolBlockRevision',
				probeAtomPrefixes: ['/pool/[chainId]/[poolId]/amm-observation/[blockSelector]/[sourceRevision]:LiquidityPool_Amm_EvmBlock.PoolBlockRevision'],
				probeCases: [[[0, '1', ['blockSelector', 'sourceRevision', 'poolId', 'chainId']]]],
			},
		],
	},
	'/(assets)/pool/[chainId]/[poolId]/amm-observation/[blockSelector]/[sourceRevision]/input-asset/[ordinal]': {
		routeId: '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/amm-observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]/(liquidityPoolAmmEvmBlock)/input-asset/[ordinal=nonNegativeInteger]',
		mappings: [
			{
				id: 'LiquidityPool_Amm_EvmBlock_InputAsset.ObservationOrdinal',
				probeAtomPrefixes: ['/pool/[chainId]/[poolId]/amm-observation/[blockSelector]/[sourceRevision]/input-asset/[ordinal]:LiquidityPool_Amm_EvmBlock_InputAsset.ObservationOrdinal'],
				probeCases: [[[0, '1', ['ordinal', 'blockSelector', 'sourceRevision', 'poolId', 'chainId']]]],
			},
		],
	},
	'/(assets)/uniswap-cca/auction/[chainId]/[auctionAddress]': {
		routeId: '/(assets)/uniswap-cca/auction/[chainId=eip155ChainId]/[auctionAddress=evmAddress]',
		mappings: [
			{
				id: 'UniswapCcaAuction.NetworkAuctionAddress',
				probeAtomPrefixes: ['/uniswap-cca/auction/[chainId]/[auctionAddress]:UniswapCcaAuction.NetworkAuctionAddress'],
				probeCases: [[[0, '1', ['auctionAddress', 'chainId']]]],
			},
		],
	},
	'/(assets)/uniswap-cca/auction/[chainId]/[auctionAddress]/block/[blockNumber]': {
		routeId: '/(assets)/uniswap-cca/auction/[chainId=eip155ChainId]/[auctionAddress=evmAddress]/(uniswapCcaAuction)/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'UniswapCcaAuction_EvmBlock.AuctionBlockNumber',
				probeAtomPrefixes: ['/uniswap-cca/auction/[chainId]/[auctionAddress]/block/[blockNumber]:UniswapCcaAuction_EvmBlock.AuctionBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'chainId', 'auctionAddress']]]],
			},
		],
	},
	'/(assets)/uniswap-v3/pool/[chainId]/[poolAddress]': {
		routeId: '/(assets)/uniswap-v3/pool/[chainId=eip155ChainId]/[poolAddress=evmAddress]',
		mappings: [
			{
				id: 'UniswapV3Pool.NetworkPoolAddress',
				probeAtomPrefixes: ['/uniswap-v3/pool/[chainId]/[poolAddress]:UniswapV3Pool.NetworkPoolAddress'],
				probeCases: [[[0, '1', ['poolAddress', 'chainId']]]],
			},
		],
	},
	'/(assets)/uniswap-v3/pool/[chainId]/[poolAddress]/block/[blockNumber]': {
		routeId: '/(assets)/uniswap-v3/pool/[chainId=eip155ChainId]/[poolAddress=evmAddress]/(uniswapV3Pool)/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'UniswapV3Pool_Block.PoolBlockNumber',
				probeAtomPrefixes: ['/uniswap-v3/pool/[chainId]/[poolAddress]/block/[blockNumber]:UniswapV3Pool_Block.PoolBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'chainId', 'poolAddress']]]],
			},
		],
	},
	'/(assets)/uniswap-v3/position/[positionManager]/[tokenId]': {
		routeId: '/(assets)/uniswap-v3/position/[positionManager=evmAddress]/[tokenId=nonNegativeBigInt]',
		mappings: [
			{
				id: 'UniswapV3Position.PositionManagerTokenId',
				probeAtomPrefixes: ['/uniswap-v3/position/[positionManager]/[tokenId]:UniswapV3Position.PositionManagerTokenId'],
				probeCases: [[[0, '1', ['positionManager', 'tokenId']]]],
			},
		],
	},
	'/(assets)/uniswap-v3/position/[positionManager]/[tokenId]/block/[blockNumber]': {
		routeId: '/(assets)/uniswap-v3/position/[positionManager=evmAddress]/[tokenId=nonNegativeBigInt]/(uniswapV3Position)/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'UniswapV3Position_Block.PositionBlockNumber',
				probeAtomPrefixes: ['/uniswap-v3/position/[positionManager]/[tokenId]/block/[blockNumber]:UniswapV3Position_Block.PositionBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'positionManager', 'tokenId']]]],
			},
		],
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]': {
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]',
		mappings: [
			{
				id: 'Market.BaseQuoteMarketVenueKind',
				probeAtomPrefixes: ['/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]:Market.BaseQuoteMarketVenueKind'],
				probeCases: [[[0, '1', ['marketKind', 'base', 'quote', 'marketVenue', 'baseKind', 'quoteKind']]]],
			},
		],
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]': {
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs',
				probeAtomPrefixes: ['/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs'],
				probeCases: [[[0, '1', ['timestampMs', 'timeIntervalUnit', 'timeIntervalValue', 'marketKind', 'base', 'quote', 'marketVenue', 'baseKind', 'quoteKind']]]],
			},
		],
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]': {
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
		parameterEncodingByName: {
			feedKey: 'Opaque',
		},
		mappings: [
			{
				id: 'Market_Derivative_Timestamp.MarketTimestampMsFeedKey',
				probeAtomPrefixes: ['/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]:Market_Derivative_Timestamp.MarketTimestampMsFeedKey'],
				probeCases: [[[0, '1', ['timestampMs', 'feedKey', 'marketKind', 'base', 'quote', 'marketVenue', 'baseKind', 'quoteKind']]]],
			},
		],
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price': {
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price',
		mappings: [
			{
				id: 'MarketPrice.Market',
				probeAtomPrefixes: ['/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price:MarketPrice.Market'],
				probeCases: [[[0, '1', ['marketKind', 'base', 'quote', 'marketVenue', 'baseKind', 'quoteKind']]]],
			},
		],
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]': {
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
		parameterEncodingByName: {
			feedKey: 'Opaque',
		},
		mappings: [
			{
				id: 'Market_Timestamp.MarketTimestampMsFeedKey',
				probeAtomPrefixes: ['/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]:Market_Timestamp.MarketTimestampMsFeedKey'],
				probeCases: [[[0, '1', ['timestampMs', 'feedKey', 'marketKind', 'base', 'quote', 'marketVenue', 'baseKind', 'quoteKind']]]],
			},
		],
	},
	'/(avalanche)/avalanche/blockchain/[blockchainId]': {
		routeId: '/(avalanche)/avalanche/blockchain/[blockchainId=stringSegment]',
		mappings: [
			{
				id: 'AvalancheBlockchain.BlockchainId',
				probeAtomPrefixes: ['/avalanche/blockchain/[blockchainId]:AvalancheBlockchain.BlockchainId'],
				probeCases: [[[0, '1', ['blockchainId']]]],
			},
		],
	},
	'/(avalanche)/avalanche/subnet/[subnetId]': {
		routeId: '/(avalanche)/avalanche/subnet/[subnetId=stringSegment]',
		mappings: [
			{
				id: 'AvalancheSubnet.SubnetId',
				probeAtomPrefixes: ['/avalanche/subnet/[subnetId]:AvalancheSubnet.SubnetId'],
				probeCases: [[[0, '1', ['subnetId']]]],
			},
		],
	},
	'/(avalanche)/avalanche/subnet/[subnetId]/observations/[timestampMs]/[source]': {
		routeId: '/(avalanche)/avalanche/subnet/[subnetId=stringSegment]/(avalancheSubnet)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AvalancheSubnet_Timestamp.SubnetTimestampMsSource',
				probeAtomPrefixes: ['/avalanche/subnet/[subnetId]/observations/[timestampMs]/[source]:AvalancheSubnet_Timestamp.SubnetTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'subnetId']]]],
			},
		],
	},
	'/(avalanche)/avalanche/validator/[nodeId]/[subnetId]/[startTimeMs]': {
		routeId: '/(avalanche)/avalanche/validator/[nodeId=stringSegment]/[subnetId=stringSegment]/[startTimeMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'AvalancheValidator.NodeIdSubnetIdStartTimeMs',
				probeAtomPrefixes: ['/avalanche/validator/[nodeId]/[subnetId]/[startTimeMs]:AvalancheValidator.NodeIdSubnetIdStartTimeMs'],
				probeCases: [[[0, '1', ['nodeId', 'subnetId', 'startTimeMs']]]],
			},
		],
	},
	'/(avalanche)/avalanche/validator/[nodeId]/[subnetId]/[startTimeMs]/delegator/[txId]': {
		routeId: '/(avalanche)/avalanche/validator/[nodeId=stringSegment]/[subnetId=stringSegment]/[startTimeMs=nonNegativeInteger]/(avalancheValidator)/delegator/[txId=stringSegment]',
		mappings: [
			{
				id: 'AvalancheDelegator.ValidatorTxId',
				probeAtomPrefixes: ['/avalanche/validator/[nodeId]/[subnetId]/[startTimeMs]/delegator/[txId]:AvalancheDelegator.ValidatorTxId'],
				probeCases: [[[0, '1', ['txId', 'nodeId', 'subnetId', 'startTimeMs']]]],
			},
		],
	},
	'/(avalanche)/avalanche/validator/[nodeId]/[subnetId]/[startTimeMs]/observations/[timestampMs]/[source]': {
		routeId: '/(avalanche)/avalanche/validator/[nodeId=stringSegment]/[subnetId=stringSegment]/[startTimeMs=nonNegativeInteger]/(avalancheValidator)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AvalancheValidator_Timestamp.ValidatorTimestampMsSource',
				probeAtomPrefixes: ['/avalanche/validator/[nodeId]/[subnetId]/[startTimeMs]/observations/[timestampMs]/[source]:AvalancheValidator_Timestamp.ValidatorTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'nodeId', 'subnetId', 'startTimeMs']]]],
			},
		],
	},
	'/(bittorrent)/bittorrent/dht-node/[nodeId]/observations/[timestampMs]/[source]': {
		routeId: '/(bittorrent)/bittorrent/dht-node/[nodeId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BitTorrentDhtNode_Timestamp.NodeIdTimestampMsSource',
				probeAtomPrefixes: ['/bittorrent/dht-node/[nodeId]/observations/[timestampMs]/[source]:BitTorrentDhtNode_Timestamp.NodeIdTimestampMsSource'],
				probeCases: [[[0, '1', ['nodeId', 'timestampMs', 'source']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]',
		parameterEncodingByName: {
			ensName: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				probeAtomPrefixes: ['/ens/name/[ensName]:EnsName.NormalizedName'],
				probeCases: [[[0, '1', ['ensName']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]/record/[recordId]': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]',
		parameterEncodingByName: {
			ensName: 'Opaque',
			recordId: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsRecord.NameRecordKey',
				probeAtomPrefixes: ['/ens/name/[ensName]/record/[recordId]:EnsRecord.NameRecordKey'],
				probeCases: [[[0, '1', ['recordId', 'ensName']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]/records': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/records',
		parameterEncodingByName: {
			ensName: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				probeAtomPrefixes: ['/ens/name/[ensName]:EnsName.NormalizedName'],
				probeCases: [[[0, '1', ['ensName']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]/resolver': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/resolver',
		parameterEncodingByName: {
			ensName: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				probeAtomPrefixes: ['/ens/name/[ensName]:EnsName.NormalizedName'],
				probeCases: [[[0, '1', ['ensName']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]/resolves-to': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/resolves-to',
		parameterEncodingByName: {
			ensName: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				probeAtomPrefixes: ['/ens/name/[ensName]:EnsName.NormalizedName'],
				probeCases: [[[0, '1', ['ensName']]]],
			},
		],
	},
	'/(explore)/(ipfs)/[namespace]/[target]': {
		routeId: '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]',
		mappings: [
			{
				id: 'IpfsResource.ResourceAddress',
				probeAtomPrefixes: ['/[namespace]/[target]:IpfsResource.ResourceAddress'],
				probeCases: [[[0, '1', ['namespace', 'target']]]],
			},
		],
	},
	'/(explore)/(ipfs)/[namespace]/[target]/path/[...contentPath]': {
		routeId: '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]',
		mappings: [
			{
				id: 'IpfsResource.ResourceAddress',
				probeCaseId: 'path',
				probeAtomPrefixes: ['/[namespace]/[target]:IpfsResource.ResourceAddress', '/[namespace]/[target]/path/[...contentPath]:IpfsResource.ResourceAddress.path'],
				probeCases: [[[0, '1', ['namespace', 'target']], [1, '1', ['contentPath']]]],
			},
		],
	},
	'/(explore)/(ipfs)/[namespace]/captures/[target]/[timestampMs]/[source]': {
		routeId: '/(explore)/(ipfs)/[namespace=ipfsNamespace]/captures/[target=stringSegment]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'IpfsResource_Timestamp.ResourceTimestampMsSource',
				probeAtomPrefixes: ['/[namespace]/captures/[target]/[timestampMs]/[source]:IpfsResource_Timestamp.ResourceTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'namespace', 'target']]]],
			},
		],
	},
	'/(explore)/(ipfs)/[namespace]/captures/[target]/[timestampMs]/[source]/path/[...contentPath]': {
		routeId: '/(explore)/(ipfs)/[namespace=ipfsNamespace]/captures/[target=stringSegment]/[timestampMs=nonNegativeInteger]/[source=stringSegment]/path/[...contentPath=stringSegment]',
		mappings: [
			{
				id: 'IpfsResource_Timestamp.ResourceTimestampMsSource',
				probeCaseId: 'path',
				probeAtomPrefixes: ['/[namespace]/captures/[target]/[timestampMs]/[source]:IpfsResource_Timestamp.ResourceTimestampMsSource', '/[namespace]/captures/[target]/[timestampMs]/[source]/path/[...contentPath]:IpfsResource_Timestamp.ResourceTimestampMsSource.path'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'namespace', 'target']], [1, '1', ['contentPath']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
		mappings: [
			{
				id: 'AptosAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:AptosAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
			{
				id: 'PolkadotAccount.NetworkAccountId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:PolkadotAccount.NetworkAccountId'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'CosmosAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:CosmosAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HederaAccount.NetworkAccountId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:HederaAccount.NetworkAccountId'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'EvmNetworkAccount.EvmNetworkEvmAccount',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:EvmNetworkAccount.EvmNetworkEvmAccount'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaAccount.NetworkPubkey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:SolanaAccount.NetworkPubkey'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'StarknetContract.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:StarknetContract.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
			{
				id: 'TronAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:TronAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
			{
				id: 'TonAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:TonAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Ton',
				],
			},
			{
				id: 'XrplAccount.NetworkAccount',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:XrplAccount.NetworkAccount'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
			{
				id: 'NearAccount.NetworkAccountId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:NearAccount.NetworkAccountId'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
			{
				id: 'HyperliquidAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:HyperliquidAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
			{
				id: 'QuilibriumAccount.NetworkAccountAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:QuilibriumAccount.NetworkAccountAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Quilibrium',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/aave-market/[poolAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/aave-market/[poolAddress=evmAddress]',
		mappings: [
			{
				id: 'AaveAccountMarket.AccountMarket',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/aave-market/[poolAddress]:AaveAccountMarket.AccountMarket'],
				probeCases: [[[0, '1', ['poolAddress', 'accountId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/aave-market/[poolAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/aave-market/[poolAddress=evmAddress]/(aaveAccountMarket)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AaveAccountMarket_Timestamp.AccountMarketTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/aave-market/[poolAddress]/observations/[timestampMs]/[source]:AaveAccountMarket_Timestamp.AccountMarketTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'poolAddress', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/aave-market/[poolAddress]/reserve/[underlyingTokenAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/aave-market/[poolAddress=evmAddress]/(aaveAccountMarket)/reserve/[underlyingTokenAddress=evmAddress]',
		mappings: [
			{
				id: 'AaveReservePosition.AccountPoolAddressUnderlyingTokenAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/aave-market/[poolAddress]/reserve/[underlyingTokenAddress]:AaveReservePosition.AccountPoolAddressUnderlyingTokenAddress'],
				probeCases: [[[0, '1', ['poolAddress', 'underlyingTokenAddress', 'accountId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/access-key/[publicKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/access-key/[publicKey=stringSegment]',
		mappings: [
			{
				id: 'NearAccessKey.NearAccountPublicKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/access-key/[publicKey]:NearAccessKey.NearAccountPublicKey'],
				probeCases: [[[0, '1', ['publicKey', 'accountId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/access-key/[publicKey]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/access-key/[publicKey=stringSegment]/(nearAccessKey)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'NearAccessKey_Timestamp.AccessKeyTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/access-key/[publicKey]/observations/[timestampMs]/[source]:NearAccessKey_Timestamp.AccessKeyTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'publicKey', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/allowance/nft/[tokenId]/[serialNumber]/spender/[spenderAccountId]/[allowanceKind]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/nft/[tokenId=stringSegment]/[serialNumber=nonNegativeBigInt]/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]',
		mappings: [
			{
				id: 'HederaAllowance.OwnerSpenderAllowanceKindTokenIdSerialNumber',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/allowance/nft/[tokenId]/[serialNumber]/spender/[spenderAccountId]/[allowanceKind]:HederaAllowance.OwnerSpenderAllowanceKindTokenIdSerialNumber'],
				probeCases: [[[0, '1', ['allowanceKind', 'tokenId', 'serialNumber', 'spenderAccountId', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/allowance/spender/[spenderAccountId]/[allowanceKind]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]',
		mappings: [
			{
				id: 'HederaAllowance.OwnerSpenderAllowanceKind',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/allowance/spender/[spenderAccountId]/[allowanceKind]:HederaAllowance.OwnerSpenderAllowanceKind'],
				probeCases: [[[0, '1', ['allowanceKind', 'spenderAccountId', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/allowance/spender/[spenderAccountId]/[allowanceKind]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]/(hederaAllowance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaAllowance_Timestamp.AllowanceTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/allowance/spender/[spenderAccountId]/[allowanceKind]/observations/[timestampMs]/[source]:HederaAllowance_Timestamp.AllowanceTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'allowanceKind', 'spenderAccountId', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/allowance/token/[tokenId]/spender/[spenderAccountId]/[allowanceKind]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/allowance/token/[tokenId=stringSegment]/spender/[spenderAccountId=stringSegment]/[allowanceKind=stringSegment]',
		mappings: [
			{
				id: 'HederaAllowance.OwnerSpenderAllowanceKindTokenId',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/allowance/token/[tokenId]/spender/[spenderAccountId]/[allowanceKind]:HederaAllowance.OwnerSpenderAllowanceKindTokenId'],
				probeCases: [[[0, '1', ['allowanceKind', 'tokenId', 'spenderAccountId', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/balance/[tokenIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/balance/[tokenIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'HyperliquidBalance.AccountTokenIndex',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/balance/[tokenIndex]:HyperliquidBalance.AccountTokenIndex'],
				probeCases: [[[0, '1', ['tokenIndex', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/balancer/vebal': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/balancer/vebal',
		mappings: [
			{
				id: 'BalancerVeBalBalance.Account',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/balancer/vebal:BalancerVeBalBalance.Account'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/block-state/[blockHeight]/[blockHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/block-state/[blockHeight=nonNegativeBigInt]/[blockHash=stringSegment]',
		mappings: [
			{
				id: 'NearAccount_Block.AccountBlock',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/block-state/[blockHeight]/[blockHash]:NearAccount_Block.AccountBlock'],
				probeCases: [[[0, '1', ['blockHeight', 'blockHash', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/borrow-lend/[tokenIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/borrow-lend/[tokenIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'HyperliquidBorrowLendPosition.AccountTokenIndex',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/borrow-lend/[tokenIndex]:HyperliquidBorrowLendPosition.AccountTokenIndex'],
				probeCases: [[[0, '1', ['tokenIndex', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/builder/[builder]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/builder/[builder=evmAddress]',
		mappings: [
			{
				id: 'HyperliquidBuilderApproval.AccountBuilder',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/builder/[builder]:HyperliquidBuilderApproval.AccountBuilder'],
				probeCases: [[[0, '1', ['builder', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/coin-balance/[storageId]/observation/[ledgerVersion]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/coin-balance/[storageId=stringSegment]/observation/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AptosCoinBalance_Timestamp.AccountStorageIdLedgerVersionSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/coin-balance/[storageId]/observation/[ledgerVersion]/[source]:AptosCoinBalance_Timestamp.AccountStorageIdLedgerVersionSource'],
				probeCases: [[[0, '1', ['storageId', 'ledgerVersion', 'source', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/contract': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/contract',
		mappings: [
			{
				id: 'TonContract.Account',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/contract:TonContract.Account'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/contract/method/[methodName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/contract/(tonContract)/method/[methodName=stringSegment]',
		mappings: [
			{
				id: 'TonContractGetMethod.ContractMethodName',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/contract/method/[methodName]:TonContractGetMethod.ContractMethodName'],
				probeCases: [[[0, '1', ['methodName', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/contract/method/[methodName]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/contract/(tonContract)/method/[methodName=stringSegment]/(tonContractGetMethod)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TonContractGetMethod_Timestamp.MethodTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/contract/method/[methodName]/observations/[timestampMs]/[source]:TonContractGetMethod_Timestamp.MethodTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'methodName', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/contract/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/contract/(tonContract)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TonContract_Timestamp.ContractTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/contract/observations/[timestampMs]/[source]:TonContract_Timestamp.ContractTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/eigenlayer/reward/[rewardContextKey]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/eigenlayer/reward/[rewardContextKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EigenLayerReward_Timestamp.EarnerRewardContextKeyTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/eigenlayer/reward/[rewardContextKey]/observations/[timestampMs]/[source]:EigenLayerReward_Timestamp.EarnerRewardContextKeyTimestampMsSource'],
				probeCases: [[[0, '1', ['rewardContextKey', 'timestampMs', 'source', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/fill/[tid]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/fill/[tid=nonNegativeBigInt]',
		mappings: [
			{
				id: 'HyperliquidFill.AccountTid',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/fill/[tid]:HyperliquidFill.AccountTid'],
				probeCases: [[[0, '1', ['tid', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/gmx/position/[contractKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/gmx/position/[contractKey=evmTxHash]',
		mappings: [
			{
				id: 'GmxPosition.AccountContractKey',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/gmx/position/[contractKey]:GmxPosition.AccountContractKey'],
				probeCases: [[[0, '1', ['contractKey', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/jetton/[masterAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/jetton/[masterAddress=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TonJettonBalance_Timestamp.AccountJettonTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/jetton/[masterAddress]/observations/[timestampMs]/[source]:TonJettonBalance_Timestamp.AccountJettonTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'masterAddress', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'PolkadotAccount_Timestamp.AccountTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:PolkadotAccount_Timestamp.AccountTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'accountId', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'CosmosAccount_Timestamp.AccountTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:CosmosAccount_Timestamp.AccountTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'accountId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'EvmNetworkAccount_Timestamp.AccountTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:EvmNetworkAccount_Timestamp.AccountTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'accountId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'HederaAccount_Timestamp.AccountTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:HederaAccount_Timestamp.AccountTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'accountId', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'TonAccount_Timestamp.AccountTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:TonAccount_Timestamp.AccountTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'accountId', 'network']]]],
				projectionPath: [
					'Ton',
				],
			},
			{
				id: 'TronAccount_Timestamp.AccountTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:TronAccount_Timestamp.AccountTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'accountId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/aptos-ledger/[ledgerVersion]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/aptos-ledger/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AptosAccount_Timestamp.AccountLedgerVersionSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/aptos-ledger/[ledgerVersion]/[source]:AptosAccount_Timestamp.AccountLedgerVersionSource'],
				probeCases: [[[0, '1', ['source', 'ledgerVersion', 'accountId', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/solana-slot/[slot]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/solana-slot/[slot=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'SolanaAccount_Timestamp.AccountSlotSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/solana-slot/[slot]/[source]:SolanaAccount_Timestamp.AccountSlotSource'],
				probeCases: [[[0, '1', ['source', 'slot', 'accountId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/starknet-block/[blockNumber]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/starknet-block/[blockNumber=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'StarknetAccount_Timestamp.ContractBlockNumberSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/starknet-block/[blockNumber]/[source]:StarknetAccount_Timestamp.ContractBlockNumberSource'],
				probeCases: [[[0, '1', ['source', 'blockNumber', 'accountId', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/xrpl-ledger/[ledgerIndex]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/xrpl-ledger/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'XrplAccount_Timestamp.AccountLedgerIndexSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/xrpl-ledger/[ledgerIndex]/[source]:XrplAccount_Timestamp.AccountLedgerIndexSource'],
				probeCases: [[[0, '1', ['source', 'ledgerIndex', 'accountId', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/order/client/[cloid]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/order/client/[cloid=stringSegment]',
		mappings: [
			{
				id: 'HyperliquidOrder.AccountCloid',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/order/client/[cloid]:HyperliquidOrder.AccountCloid'],
				probeCases: [[[0, '1', ['cloid', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/order/client/[cloid]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/order/client/[cloid=stringSegment]/(hyperliquidOrder)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HyperliquidOrder_Timestamp.OrderTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/order/client/[cloid]/observations/[timestampMs]/[source]:HyperliquidOrder_Timestamp.OrderTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'cloid', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/order/id/[oid]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/order/id/[oid=nonNegativeBigInt]',
		mappings: [
			{
				id: 'HyperliquidOrder.AccountOid',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/order/id/[oid]:HyperliquidOrder.AccountOid'],
				probeCases: [[[0, '1', ['oid', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/position/[coin]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/position/[coin=stringSegment]',
		mappings: [
			{
				id: 'HyperliquidPosition.AccountCoin',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/position/[coin]:HyperliquidPosition.AccountCoin'],
				probeCases: [[[0, '1', ['coin', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/resource/[resourceType]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/resource/[resourceType=stringSegment]',
		mappings: [
			{
				id: 'AptosAccountResource.AccountResourceType',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/resource/[resourceType]:AptosAccountResource.AccountResourceType'],
				probeCases: [[[0, '1', ['resourceType', 'accountId', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/resource/[resourceType]/observation/[ledgerVersion]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/resource/[resourceType=stringSegment]/(aptosAccountResource)/observation/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AptosAccountResource_Timestamp.ResourceLedgerVersionSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/resource/[resourceType]/observation/[ledgerVersion]/[source]:AptosAccountResource_Timestamp.ResourceLedgerVersionSource'],
				probeCases: [[[0, '1', ['ledgerVersion', 'source', 'resourceType', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/starknet-token/[tokenAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/starknet-token/[tokenAddress=stringSegment]',
		mappings: [
			{
				id: 'StarknetTokenHolding.OwnerTokenContract',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/starknet-token/[tokenAddress]:StarknetTokenHolding.OwnerTokenContract'],
				probeCases: [[[0, '1', ['tokenAddress', 'accountId', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/storage/[storageKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/storage/[storageKey=stringSegment]',
		mappings: [
			{
				id: 'StarknetStorageEntry.ContractStorageKey',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/storage/[storageKey]:StarknetStorageEntry.ContractStorageKey'],
				probeCases: [[[0, '1', ['storageKey', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/storage/[storageKey]/block/[blockNumber]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/storage/[storageKey=stringSegment]/(starknetStorageEntry)/block/[blockNumber=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'StarknetStorageEntry_Timestamp.EntryBlockNumberSource',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/storage/[storageKey]/block/[blockNumber]/[source]:StarknetStorageEntry_Timestamp.EntryBlockNumberSource'],
				probeCases: [[[0, '1', ['blockNumber', 'source', 'storageKey', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/token/[tokenId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/token/[tokenId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TronAccountTokenBalance_Timestamp.AccountTokenTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/token/[tokenId]/observations/[timestampMs]/[source]:TronAccountTokenBalance_Timestamp.AccountTokenTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'tokenId', 'accountId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
			{
				id: 'HederaTokenAssociation_Timestamp.AssociationTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/token/[tokenId]/observations/[timestampMs]/[source]:HederaTokenAssociation_Timestamp.AssociationTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'tokenId', 'accountId', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/transaction/[lt]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]',
		mappings: [
			{
				id: 'TonTransaction.AccountLt',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/transaction/[lt]:TonTransaction.AccountLt'],
				probeCases: [[[0, '1', ['lt', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/transaction/[lt]/[hash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]/(tonTransaction)/[hash=stringSegment]',
		mappings: [
			{
				id: 'TonTransaction.AccountLtHash',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/transaction/[lt]/[hash]:TonTransaction.AccountLtHash'],
				probeCases: [[[0, '1', ['lt', 'hash', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/transaction/[lt]/message/[outIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]/(tonTransaction)/message/[outIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'TonMessage.SourceTransactionOutIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/transaction/[lt]/message/[outIndex]:TonMessage.SourceTransactionOutIndex'],
				probeCases: [[[0, '1', ['outIndex', 'lt', 'accountId', 'network']]]],
				projectionPath: [
					'Ton',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/transaction/[lt]/phase/[phaseKind]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]/(tonTransaction)/phase/[phaseKind=stringSegment]',
		mappings: [
			{
				id: 'TonTransactionPhase.TransactionPhaseKind',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/transaction/[lt]/phase/[phaseKind]:TonTransactionPhase.TransactionPhaseKind'],
				probeCases: [[[0, '1', ['phaseKind', 'lt', 'accountId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/cardano/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/cardano/[address=stringSegment]',
		mappings: [
			{
				id: 'CardanoAddress.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/cardano/[address]:CardanoAddress.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/cardano/[address]/observation/cardano-block/[blockSlot]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/cardano/[address=stringSegment]/(cardanoAddress)/observation/cardano-block/[blockSlot=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoAddress_Timestamp.AddressBlockSlotSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/cardano/[address]/observation/cardano-block/[blockSlot]/[source]:CardanoAddress_Timestamp.AddressBlockSlotSource'],
				probeCases: [[[0, '1', ['source', 'blockSlot', 'address', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/account/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]',
		mappings: [
			{
				id: 'AlgorandAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/account/[address]:AlgorandAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/account/[address]/application/[applicationNetwork]/[applicationId]/round/[round]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]/(algorandAccount)/application/[applicationNetwork=networkCaip2]/[applicationId=nonNegativeBigInt]/round/[round=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AlgorandApplicationLocalState_Round.AccountApplicationRoundSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/account/[address]/application/[applicationNetwork]/[applicationId]/round/[round]/[source]:AlgorandApplicationLocalState_Round.AccountApplicationRoundSource'],
				probeCases: [[[0, '1', ['round', 'source', 'applicationNetwork', 'applicationId', 'address', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/account/[address]/asset/[assetNetwork]/[assetId]/round/[round]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]/(algorandAccount)/asset/[assetNetwork=networkCaip2]/[assetId=nonNegativeBigInt]/round/[round=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AlgorandAssetHolding_Round.AccountAssetRoundSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/account/[address]/asset/[assetNetwork]/[assetId]/round/[round]/[source]:AlgorandAssetHolding_Round.AccountAssetRoundSource'],
				probeCases: [[[0, '1', ['round', 'source', 'assetNetwork', 'assetId', 'address', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/account/[address]/observation/[round]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]/(algorandAccount)/observation/[round=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AlgorandAccount_Timestamp.AccountRoundSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/account/[address]/observation/[round]/[source]:AlgorandAccount_Timestamp.AccountRoundSource'],
				probeCases: [[[0, '1', ['round', 'source', 'address', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/application/[applicationId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/application/[applicationId=nonNegativeBigInt]',
		mappings: [
			{
				id: 'AlgorandApplication.NetworkApplicationId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/application/[applicationId]:AlgorandApplication.NetworkApplicationId'],
				probeCases: [[[0, '1', ['applicationId', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/application/[applicationId]/box/[boxName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/application/[applicationId=nonNegativeBigInt]/(algorandApplication)/box/[boxName=zeroExHex]',
		mappings: [
			{
				id: 'AlgorandBox.ApplicationBoxName',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/application/[applicationId]/box/[boxName]:AlgorandBox.ApplicationBoxName'],
				probeCases: [[[0, '1', ['boxName', 'applicationId', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/application/[applicationId]/box/[boxName]/observation/[round]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/application/[applicationId=nonNegativeBigInt]/(algorandApplication)/box/[boxName=zeroExHex]/(algorandBox)/observation/[round=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AlgorandBox_Round.BoxRoundSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/application/[applicationId]/box/[boxName]/observation/[round]/[source]:AlgorandBox_Round.BoxRoundSource'],
				probeCases: [[[0, '1', ['round', 'source', 'boxName', 'applicationId', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/application/[applicationId]/observation/[round]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/application/[applicationId=nonNegativeBigInt]/(algorandApplication)/observation/[round=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AlgorandApplication_Timestamp.ApplicationRoundSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/application/[applicationId]/observation/[round]/[source]:AlgorandApplication_Timestamp.ApplicationRoundSource'],
				probeCases: [[[0, '1', ['round', 'source', 'applicationId', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/asset/[assetId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/asset/[assetId=nonNegativeBigInt]',
		mappings: [
			{
				id: 'AlgorandAsset.NetworkAssetId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/asset/[assetId]:AlgorandAsset.NetworkAssetId'],
				probeCases: [[[0, '1', ['assetId', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/asset/[assetId]/observation/[round]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/asset/[assetId=nonNegativeBigInt]/(algorandAsset)/observation/[round=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AlgorandAsset_Timestamp.AssetRoundSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/asset/[assetId]/observation/[round]/[source]:AlgorandAsset_Timestamp.AssetRoundSource'],
				probeCases: [[[0, '1', ['round', 'source', 'assetId', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AlgorandNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/observations/[timestampMs]/[source]:AlgorandNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/round/[round]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/round/[round=nonNegativeBigInt]',
		mappings: [
			{
				id: 'AlgorandRound.NetworkRound',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/round/[round]:AlgorandRound.NetworkRound'],
				probeCases: [[[0, '1', ['round', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/teal-program/[programHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/teal-program/[programHash=zeroExHex]',
		mappings: [
			{
				id: 'AlgorandTealProgram.NetworkProgramHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/teal-program/[programHash]:AlgorandTealProgram.NetworkProgramHash'],
				probeCases: [[[0, '1', ['programHash', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/teal-program/[programHash]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/teal-program/[programHash=zeroExHex]/(algorandTealProgram)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AlgorandTealProgram_Timestamp.ProgramTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/teal-program/[programHash]/observations/[timestampMs]/[source]:AlgorandTealProgram_Timestamp.ProgramTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'programHash', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/transaction-group/[group]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/transaction-group/[group=zeroExHex]',
		mappings: [
			{
				id: 'AlgorandTransactionGroup.NetworkGroup',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/transaction-group/[group]:AlgorandTransactionGroup.NetworkGroup'],
				probeCases: [[[0, '1', ['group', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/transaction/[txId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/transaction/[txId=stringSegment]',
		mappings: [
			{
				id: 'AlgorandTransaction.NetworkTxId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/transaction/[txId]:AlgorandTransaction.NetworkTxId'],
				probeCases: [[[0, '1', ['txId', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(algorand)/algorand/transaction/[txId]/proof/[round]/[hashType]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/transaction/[txId=stringSegment]/(algorandTransaction)/proof/[round=nonNegativeBigInt]/[hashType=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'AlgorandTransactionProof.TransactionRoundHashTypeSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/algorand/transaction/[txId]/proof/[round]/[hashType]/[source]:AlgorandTransactionProof.TransactionRoundHashTypeSource'],
				probeCases: [[[0, '1', ['round', 'hashType', 'source', 'txId', 'network']]]],
				projectionPath: [
					'Algorand',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blobs)/blob/[transactionId]/[indexInTransaction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]',
		mappings: [
			{
				id: 'EvmBlob.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/blob/[transactionId]/[indexInTransaction]:EvmBlob.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['transactionId', 'indexInTransaction', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'EvmBlock.EvmNetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:EvmBlock.EvmNetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaBlock.Slot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:SolanaBlock.Slot'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:UtxoBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'PolkadotBlock.NetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:PolkadotBlock.NetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'ArweaveBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:ArweaveBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Arweave',
				],
			},
			{
				id: 'CosmosBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:CosmosBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HederaBlock.NetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:HederaBlock.NetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'HyperliquidBlock.Height',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:HyperliquidBlock.Height'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
			{
				id: 'MoneroBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:MoneroBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Monero',
				],
			},
			{
				id: 'NearBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:NearBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
			{
				id: 'TronBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:TronBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
		mappings: [
			{
				id: 'PolkadotBlock.NetworkBlockNumberHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]:PolkadotBlock.NetworkBlockNumberHash'],
				probeCases: [[[0, '1', ['blockNumber', 'hash', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeightHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]:UtxoBlock.NetworkHeightHash'],
				probeCases: [[[0, '1', ['blockNumber', 'hash', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'BittensorBlock.NetworkBlockNumberHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]:BittensorBlock.NetworkBlockNumberHash'],
				probeCases: [[[0, '1', ['hash', 'blockNumber', 'network']]]],
				projectionPath: [
					'Bittensor',
				],
			},
			{
				id: 'MoneroBlock.NetworkHeightHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]:MoneroBlock.NetworkHeightHash'],
				probeCases: [[[0, '1', ['hash', 'blockNumber', 'network']]]],
				projectionPath: [
					'Monero',
				],
			},
			{
				id: 'NearBlock.NetworkHeightHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]:NearBlock.NetworkHeightHash'],
				probeCases: [[[0, '1', ['hash', 'blockNumber', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
			{
				id: 'TronBlock.NetworkHeightHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]:TronBlock.NetworkHeightHash'],
				probeCases: [[[0, '1', ['hash', 'blockNumber', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/event/[eventIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/event/[eventIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'PolkadotEvent.BlockIndexInBlock',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]/event/[eventIndex]:PolkadotEvent.BlockIndexInBlock'],
				probeCases: [[[0, '1', ['eventIndex', 'blockNumber', 'hash', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/extrinsic/[extrinsicIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'PolkadotExtrinsic.BlockIndexInBlock',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]:PolkadotExtrinsic.BlockIndexInBlock'],
				probeCases: [[[0, '1', ['extrinsicIndex', 'blockNumber', 'hash', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/aux-pow': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/aux-pow',
		mappings: [
			{
				id: 'DogecoinBlockAuxPow.Block',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/aux-pow:DogecoinBlockAuxPow.Block'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/aux-pow/branch/[branchKind]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/aux-pow/(dogecoinBlockAuxPow)/branch/[branchKind=stringSegment]',
		mappings: [
			{
				id: 'DogecoinAuxPowMerkleBranch.AuxPowBranchKind',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/aux-pow/branch/[branchKind]:DogecoinAuxPowMerkleBranch.AuxPowBranchKind'],
				probeCases: [[[0, '1', ['branchKind', 'blockNumber', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/aux-pow/parent-block-header': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/aux-pow/(dogecoinBlockAuxPow)/parent-block-header',
		mappings: [
			{
				id: 'DogecoinAuxPowParentBlockHeader.AuxPow',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/aux-pow/parent-block-header:DogecoinAuxPowParentBlockHeader.AuxPow'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/mweb': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb',
		mappings: [
			{
				id: 'LitecoinMwebBlock.UtxoBlock',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/mweb:LitecoinMwebBlock.UtxoBlock'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/mweb/transaction/[transactionIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb/(litecoinMwebBlock)/transaction/[transactionIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'LitecoinMwebTransaction.LitecoinMwebBlockTransactionIndex',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/mweb/transaction/[transactionIndex]:LitecoinMwebTransaction.LitecoinMwebBlockTransactionIndex'],
				probeCases: [[[0, '1', ['transactionIndex', 'blockNumber', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/mweb/transaction/[transactionIndex]/output/[outputIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb/(litecoinMwebBlock)/transaction/[transactionIndex=nonNegativeInteger]/(litecoinMwebTransaction)/output/[outputIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'LitecoinMwebOutput.LitecoinMwebTransactionOutputIndex',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/mweb/transaction/[transactionIndex]/output/[outputIndex]:LitecoinMwebOutput.LitecoinMwebTransactionOutputIndex'],
				probeCases: [[[0, '1', ['outputIndex', 'transactionIndex', 'blockNumber', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/mweb/transaction/[transactionIndex]/peg-in/[pegInIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb/(litecoinMwebBlock)/transaction/[transactionIndex=nonNegativeInteger]/(litecoinMwebTransaction)/peg-in/[pegInIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'LitecoinMwebPegIn.LitecoinMwebTransactionPegInIndex',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/mweb/transaction/[transactionIndex]/peg-in/[pegInIndex]:LitecoinMwebPegIn.LitecoinMwebTransactionPegInIndex'],
				probeCases: [[[0, '1', ['pegInIndex', 'transactionIndex', 'blockNumber', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/mweb/transaction/[transactionIndex]/peg-out/[pegOutIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb/(litecoinMwebBlock)/transaction/[transactionIndex=nonNegativeInteger]/(litecoinMwebTransaction)/peg-out/[pegOutIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'LitecoinMwebPegOut.LitecoinMwebTransactionPegOutIndex',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/mweb/transaction/[transactionIndex]/peg-out/[pegOutIndex]:LitecoinMwebPegOut.LitecoinMwebTransactionPegOutIndex'],
				probeCases: [[[0, '1', ['pegOutIndex', 'transactionIndex', 'blockNumber', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/shielded-pool/[pool]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/shielded-pool/[pool=stringSegment]',
		mappings: [
			{
				id: 'ZcashShieldedPoolBlockState.BlockPool',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/shielded-pool/[pool]:ZcashShieldedPoolBlockState.BlockPool'],
				probeCases: [[[0, '1', ['pool', 'blockNumber', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/transactions': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/transactions',
		mappings: [
			{
				id: 'EvmBlock.EvmNetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:EvmBlock.EvmNetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaBlock.Slot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:SolanaBlock.Slot'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:UtxoBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'PolkadotBlock.NetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:PolkadotBlock.NetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'ArweaveBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:ArweaveBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Arweave',
				],
			},
			{
				id: 'CosmosBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:CosmosBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HederaBlock.NetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:HederaBlock.NetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'HyperliquidBlock.Height',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:HyperliquidBlock.Height'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
			{
				id: 'MoneroBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:MoneroBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Monero',
				],
			},
			{
				id: 'NearBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:NearBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
			{
				id: 'TronBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:TronBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/cardano/[blockNo]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/cardano/[blockNo=nonNegativeBigInt]',
		mappings: [
			{
				id: 'CardanoBlock.NetworkBlockNo',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/cardano/[blockNo]:CardanoBlock.NetworkBlockNo'],
				probeCases: [[[0, '1', ['blockNo', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/cid/[cid]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/cid/[cid=stringSegment]',
		mappings: [
			{
				id: 'FilecoinBlock.NetworkCid',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/cid/[cid]:FilecoinBlock.NetworkCid'],
				probeCases: [[[0, '1', ['cid', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/hash/[blockHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]',
		mappings: [
			{
				id: 'EvmBlock.EvmNetworkBlockHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/hash/[blockHash]:EvmBlock.EvmNetworkBlockHash'],
				probeCases: [[[0, '1', ['blockHash', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'ArweaveBlock.NetworkIndepHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/hash/[blockHash]:ArweaveBlock.NetworkIndepHash'],
				probeCases: [[[0, '1', ['blockHash', 'network']]]],
				projectionPath: [
					'Arweave',
				],
			},
			{
				id: 'CardanoBlock.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/hash/[blockHash]:CardanoBlock.NetworkHash'],
				probeCases: [[[0, '1', ['blockHash', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'CosmosBlock.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/hash/[blockHash]:CosmosBlock.NetworkHash'],
				probeCases: [[[0, '1', ['blockHash', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HederaBlock.NetworkBlockHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/hash/[blockHash]:HederaBlock.NetworkBlockHash'],
				probeCases: [[[0, '1', ['blockHash', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/slot/[slot]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/slot/[slot=nonNegativeBigInt]',
		mappings: [
			{
				id: 'CardanoBlock.NetworkSlot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/slot/[slot]:CardanoBlock.NetworkSlot'],
				probeCases: [[[0, '1', ['slot', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(bnb-beacon)/bnb-beacon/block/hash/[hash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/block/hash/[hash=stringSegment]',
		mappings: [
			{
				id: 'BnbBeaconBlock.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/bnb-beacon/block/hash/[hash]:BnbBeaconBlock.NetworkHash'],
				probeCases: [[[0, '1', ['hash', 'network']]]],
				projectionPath: [
					'BnbBeacon',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(bnb-beacon)/bnb-beacon/block/height/[height]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/block/height/[height=nonNegativeBigInt]',
		mappings: [
			{
				id: 'BnbBeaconBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/bnb-beacon/block/height/[height]:BnbBeaconBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['height', 'network']]]],
				projectionPath: [
					'BnbBeacon',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(bnb-beacon)/bnb-beacon/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BnbBeaconNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/bnb-beacon/observations/[timestampMs]/[source]:BnbBeaconNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'BnbBeacon',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(bnb-beacon)/bnb-beacon/token/[symbol]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/token/[symbol=stringSegment]',
		mappings: [
			{
				id: 'BnbBeaconToken.NetworkSymbol',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/bnb-beacon/token/[symbol]:BnbBeaconToken.NetworkSymbol'],
				probeCases: [[[0, '1', ['symbol', 'network']]]],
				projectionPath: [
					'BnbBeacon',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(bnb-beacon)/bnb-beacon/token/[symbol]/migration/[targetNetwork]/[targetAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/token/[symbol=stringSegment]/(bnbBeaconToken)/migration/[targetNetwork=networkSlug]/[targetAddress=stringSegment]',
		mappings: [
			{
				id: 'BnbBeaconTokenMigration.TokenTargetNetworkTargetAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/bnb-beacon/token/[symbol]/migration/[targetNetwork]/[targetAddress]:BnbBeaconTokenMigration.TokenTargetNetworkTargetAddress'],
				probeCases: [[[0, '1', ['targetNetwork', 'targetAddress', 'symbol', 'network']]]],
				projectionPath: [
					'BnbBeacon',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(bnb-beacon)/bnb-beacon/transaction/[txHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/transaction/[txHash=stringSegment]',
		mappings: [
			{
				id: 'BnbBeaconTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/bnb-beacon/transaction/[txHash]:BnbBeaconTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['txHash', 'network']]]],
				projectionPath: [
					'BnbBeacon',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(bnb-beacon)/bnb-beacon/transaction/[txHash]/transfer/[transferIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/transaction/[txHash=stringSegment]/(bnbBeaconTransaction)/transfer/[transferIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BnbBeaconTokenTransfer.TransactionTransferIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/bnb-beacon/transaction/[txHash]/transfer/[transferIndex]:BnbBeaconTokenTransfer.TransactionTransferIndex'],
				probeCases: [[[0, '1', ['transferIndex', 'txHash', 'network']]]],
				projectionPath: [
					'BnbBeacon',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(bnb-beacon)/bnb-beacon/validator/[operatorAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/validator/[operatorAddress=stringSegment]',
		mappings: [
			{
				id: 'BnbValidator.NetworkOperatorAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/bnb-beacon/validator/[operatorAddress]:BnbValidator.NetworkOperatorAddress'],
				probeCases: [[[0, '1', ['operatorAddress', 'network']]]],
				projectionPath: [
					'BnbBeacon',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]',
		mappings: [
			{
				id: 'EvmContract.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]:EvmContract.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'CosmosContract.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]:CosmosContract.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HederaContract.NetworkContractId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]:HederaContract.NetworkContractId'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'NearContract.NetworkAccountId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]:NearContract.NetworkAccountId'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/compilation': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/compilation',
		mappings: [
			{
				id: 'EvmContractCompilation.EvmContract',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/compilation:EvmContractCompilation.EvmContract'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/consensus-log/[consensusTimestamp]/[logIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/consensus-log/[consensusTimestamp=stringSegment]/[logIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'HederaContractLog.ContractConsensusTimestampLogIndex',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/consensus-log/[consensusTimestamp]/[logIndex]:HederaContractLog.ContractConsensusTimestampLogIndex'],
				probeCases: [[[0, '1', ['consensusTimestamp', 'logIndex', 'address', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/erc-4626': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/erc-4626',
		mappings: [
			{
				id: 'Erc4626Vault.Contract',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/erc-4626:Erc4626Vault.Contract'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/erc-4626/block/[blockNumber]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/erc-4626/(erc4626Vault)/block/[blockNumber=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Erc4626Vault_Block.VaultBlockNumberSource',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/erc-4626/block/[blockNumber]/[source]:Erc4626Vault_Block.VaultBlockNumberSource'],
				probeCases: [[[0, '1', ['blockNumber', 'source', 'address', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaContract_Timestamp.ContractTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/observations/[timestampMs]/[source]:HederaContract_Timestamp.ContractTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'NearContract_Timestamp.ContractTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/observations/[timestampMs]/[source]:NearContract_Timestamp.ContractTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/slot/[slot]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/slot/[slot=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaContractState_Timestamp.ContractSlotTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/slot/[slot]/observations/[timestampMs]/[source]:HederaContractState_Timestamp.ContractSlotTimestampMsSource'],
				probeCases: [[[0, '1', ['slot', 'timestampMs', 'source', 'address', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/source-bundle': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/source-bundle',
		mappings: [
			{
				id: 'EvmContractSourceBundle.EvmContract',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/source-bundle:EvmContractSourceBundle.EvmContract'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/storage/[keyBase64]/block/[blockHeight]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/storage/[keyBase64=stringSegment]/block/[blockHeight=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'NearContractStorageEntry.ContractKeyBlockHeightSource',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/storage/[keyBase64]/block/[blockHeight]/[source]:NearContractStorageEntry.ContractKeyBlockHeightSource'],
				probeCases: [[[0, '1', ['keyBase64', 'blockHeight', 'source', 'address', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/storage/[slot]/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/storage/[slot=zeroExHex]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmStorageRead_Timestamp.ContractSlotTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/storage/[slot]/[timestampMs]/[source]:EvmStorageRead_Timestamp.ContractSlotTimestampMsSource'],
				probeCases: [[[0, '1', ['slot', 'source', 'timestampMs', 'address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/uniswap-v3/pool/[token1Address]/[fee]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/uniswap-v3/pool/[token1Address=evmAddress]/[fee=nonNegativeInteger]',
		mappings: [
			{
				id: 'UniswapV3Pool.Token0Token1Fee',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/uniswap-v3/pool/[token1Address]/[fee]:UniswapV3Pool.Token0Token1Fee'],
				probeCases: [[[0, '1', ['fee', 'token1Address', 'address', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/verification': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/verification',
		mappings: [
			{
				id: 'EvmContractVerification.EvmContract',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/verification:EvmContractVerification.EvmContract'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(elements)/elements/asset/[assetId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(elements)/elements/asset/[assetId=stringSegment]',
		mappings: [
			{
				id: 'ElementsAsset.ElementsNetworkAssetId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/elements/asset/[assetId]:ElementsAsset.ElementsNetworkAssetId'],
				probeCases: [[[0, '1', ['assetId', 'network']]]],
				projectionPath: [
					'Elements',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(elements)/elements/peg/[pegTransactionId]/[direction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(elements)/elements/peg/[pegTransactionId=stringSegment]/[direction=stringSegment]',
		mappings: [
			{
				id: 'ElementsPeg.ElementsNetworkPegTransactionIdDirection',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/elements/peg/[pegTransactionId]/[direction]:ElementsPeg.ElementsNetworkPegTransactionIdDirection'],
				probeCases: [[[0, '1', ['pegTransactionId', 'direction', 'network']]]],
				projectionPath: [
					'Elements',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(elements)/elements/peg/[pegTransactionId]/[direction]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(elements)/elements/peg/[pegTransactionId=stringSegment]/[direction=stringSegment]/(elementsPeg)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'ElementsPeg_Timestamp.PegTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/elements/peg/[pegTransactionId]/[direction]/observations/[timestampMs]/[source]:ElementsPeg_Timestamp.PegTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'pegTransactionId', 'direction', 'network']]]],
				projectionPath: [
					'Elements',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(polkadot)/referenda': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(polkadot)/referenda',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(polkadot)/referendum/[referendumId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(polkadot)/referendum/[referendumId=stringSegment]',
		mappings: [
			{
				id: 'PolkadotReferendum.NetworkReferendumId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/referendum/[referendumId]:PolkadotReferendum.NetworkReferendumId'],
				probeCases: [[[0, '1', ['referendumId', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(polkadot)/referendum/[referendumId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(polkadot)/referendum/[referendumId=stringSegment]/(polkadotReferendum)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'PolkadotReferendum_Timestamp.ReferendumTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/referendum/[referendumId]/observations/[timestampMs]/[source]:PolkadotReferendum_Timestamp.ReferendumTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'referendumId', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(aptos)/table-item/[tableHandle]/[keyHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(aptos)/table-item/[tableHandle=stringSegment]/[keyHash=stringSegment]',
		mappings: [
			{
				id: 'AptosTableItem.NetworkTableHandleKeyHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/table-item/[tableHandle]/[keyHash]:AptosTableItem.NetworkTableHandleKeyHash'],
				probeCases: [[[0, '1', ['tableHandle', 'keyHash', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(aptos)/table-item/[tableHandle]/[keyHash]/observation/[ledgerVersion]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(aptos)/table-item/[tableHandle=stringSegment]/[keyHash=stringSegment]/(aptosTableItem)/observation/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AptosTableItem_Timestamp.TableItemLedgerVersionSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/table-item/[tableHandle]/[keyHash]/observation/[ledgerVersion]/[source]:AptosTableItem_Timestamp.TableItemLedgerVersionSource'],
				probeCases: [[[0, '1', ['ledgerVersion', 'source', 'tableHandle', 'keyHash', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(avail)/app/[appId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/app/[appId=nonNegativeInteger]',
		mappings: [
			{
				id: 'AvailAppId.NetworkAppId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/app/[appId]:AvailAppId.NetworkAppId'],
				probeCases: [[[0, '1', ['appId', 'network']]]],
				projectionPath: [
					'Avail',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(avail)/app/[appId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/app/[appId=nonNegativeInteger]/(availAppId)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AvailAppId_Timestamp.AppIdTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/app/[appId]/observations/[timestampMs]/[source]:AvailAppId_Timestamp.AppIdTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'appId', 'network']]]],
				projectionPath: [
					'Avail',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(avail)/avail/block-hash/[blockHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/avail/block-hash/[blockHash=stringSegment]',
		mappings: [
			{
				id: 'AvailBlock.NetworkBlockHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/avail/block-hash/[blockHash]:AvailBlock.NetworkBlockHash'],
				probeCases: [[[0, '1', ['blockHash', 'network']]]],
				projectionPath: [
					'Avail',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(avail)/block-number/[blockNumber]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/block-number/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'AvailBlock.NetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block-number/[blockNumber]:AvailBlock.NetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Avail',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(avail)/submission/[source]/[submissionKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/submission/[source=stringSegment]/[submissionKey=stringSegment]',
		mappings: [
			{
				id: 'AvailDataSubmission.NetworkSourceSubmissionKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/submission/[source]/[submissionKey]:AvailDataSubmission.NetworkSourceSubmissionKey'],
				probeCases: [[[0, '1', ['source', 'submissionKey', 'network']]]],
				projectionPath: [
					'Avail',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(celestia)/block-height/[height]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/block-height/[height=nonNegativeBigInt]',
		mappings: [
			{
				id: 'CelestiaBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block-height/[height]:CelestiaBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['height', 'network']]]],
				projectionPath: [
					'Celestia',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(celestia)/block-height/[height]/occurrence/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/block-height/[height=nonNegativeBigInt]/(celestiaBlock)/occurrence/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'CelestiaBlobOccurrence.BlockIndex',
				probeAtomPrefixes: ['/network/[network]/block-height/[height]/occurrence/[index]:CelestiaBlobOccurrence.BlockIndex'],
				probeCases: [[[0, '1', ['index', 'height', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(celestia)/celestia/block-hash/[hash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/celestia/block-hash/[hash=stringSegment]',
		mappings: [
			{
				id: 'CelestiaBlock.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/celestia/block-hash/[hash]:CelestiaBlock.NetworkHash'],
				probeCases: [[[0, '1', ['hash', 'network']]]],
				projectionPath: [
					'Celestia',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(celestia)/namespace/[namespaceId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]',
		mappings: [
			{
				id: 'CelestiaNamespace.NetworkNamespaceId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/namespace/[namespaceId]:CelestiaNamespace.NetworkNamespaceId'],
				probeCases: [[[0, '1', ['namespaceId', 'network']]]],
				projectionPath: [
					'Celestia',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(celestia)/namespace/[namespaceId]/blob/[height]/[commitment]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/blob/[height=nonNegativeBigInt]/[commitment=stringSegment]',
		mappings: [
			{
				id: 'CelestiaBlob.NamespaceHeightCommitment',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/namespace/[namespaceId]/blob/[height]/[commitment]:CelestiaBlob.NamespaceHeightCommitment'],
				probeCases: [[[0, '1', ['height', 'commitment', 'namespaceId', 'network']]]],
				projectionPath: [
					'Celestia',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(celestia)/namespace/[namespaceId]/blob/[height]/[commitment]/submission/[txHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/blob/[height=nonNegativeBigInt]/[commitment=stringSegment]/(celestiaBlob)/submission/[txHash=stringSegment]',
		mappings: [
			{
				id: 'CelestiaBlobSubmission.BlobTransaction',
				probeAtomPrefixes: ['/network/[network]/namespace/[namespaceId]/blob/[height]/[commitment]/submission/[txHash]:CelestiaBlobSubmission.BlobTransaction'],
				probeCases: [[[0, '1', ['txHash', 'height', 'commitment', 'namespaceId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(celestia)/namespace/[namespaceId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'CelestiaNamespace_Timestamp.NamespaceTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/namespace/[namespaceId]/observations/[timestampMs]/[source]:CelestiaNamespace_Timestamp.NamespaceTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'namespaceId', 'network']]]],
				projectionPath: [
					'Celestia',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(celestia)/namespace/[namespaceId]/occurrence/[height]/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/occurrence/[height=nonNegativeBigInt]/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'CelestiaBlobOccurrence.NamespaceHeightIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/namespace/[namespaceId]/occurrence/[height]/[index]:CelestiaBlobOccurrence.NamespaceHeightIndex'],
				probeCases: [[[0, '1', ['height', 'index', 'namespaceId', 'network']]]],
				projectionPath: [
					'Celestia',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/(dydx)/market/[ticker]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(dydx)/market/[ticker=stringSegment]',
		mappings: [
			{
				id: 'DydxChainMarket.NetworkTicker',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/market/[ticker]:DydxChainMarket.NetworkTicker'],
				probeCases: [[[0, '1', ['ticker', 'network']]]],
				projectionPath: [
					'Dydx',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/kaspa/connection/[connectionId]/node-state': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/kaspa/connection/[connectionId=stringSegment]/node-state',
		mappings: [
			{
				id: 'BlockheadKaspaNodeState.ConnectionIdNetwork',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/kaspa/connection/[connectionId]/node-state:BlockheadKaspaNodeState.ConnectionIdNetwork'],
				probeCases: [[[0, '1', ['connectionId', 'network']]]],
				projectionPath: [
					'Kaspa',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/kaspa/connection/[connectionId]/node-state/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/kaspa/connection/[connectionId=stringSegment]/node-state/(blockheadKaspaNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadKaspaNodeState_Timestamp.NodeStateTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/kaspa/connection/[connectionId]/node-state/observations/[timestampMs]/[source]:BlockheadKaspaNodeState_Timestamp.NodeStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId', 'network']]]],
				projectionPath: [
					'Kaspa',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/lightning/connection/[connectionId]/node-state': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state',
		mappings: [
			{
				id: 'BlockheadLightningNodeState.ConnectionIdNetwork',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/lightning/connection/[connectionId]/node-state:BlockheadLightningNodeState.ConnectionIdNetwork'],
				probeCases: [[[0, '1', ['connectionId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/lightning/connection/[connectionId]/node-state/channel/[channelId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/channel/[channelId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningChannelState.LocalNodeStateChannel',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/lightning/connection/[connectionId]/node-state/channel/[channelId]:BlockheadLightningChannelState.LocalNodeStateChannel'],
				probeCases: [[[0, '1', ['channelId', 'connectionId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/lightning/connection/[connectionId]/node-state/channel/[channelId]/htlc/[htlcIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/channel/[channelId=stringSegment]/(blockheadLightningChannelState)/htlc/[htlcIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadLightningHtlc.ChannelStateHtlcIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/lightning/connection/[connectionId]/node-state/channel/[channelId]/htlc/[htlcIndex]:BlockheadLightningHtlc.ChannelStateHtlcIndex'],
				probeCases: [[[0, '1', ['htlcIndex', 'channelId', 'connectionId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/lightning/connection/[connectionId]/node-state/channel/[channelId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/channel/[channelId=stringSegment]/(blockheadLightningChannelState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningChannelState_Timestamp.ChannelStateTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/lightning/connection/[connectionId]/node-state/channel/[channelId]/observations/[timestampMs]/[source]:BlockheadLightningChannelState_Timestamp.ChannelStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'channelId', 'connectionId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/lightning/connection/[connectionId]/node-state/forward': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/forward',
		mappings: [
			{
				id: 'BlockheadLightningNodeState.ConnectionIdNetwork',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/lightning/connection/[connectionId]/node-state:BlockheadLightningNodeState.ConnectionIdNetwork'],
				probeCases: [[[0, '1', ['connectionId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/lightning/connection/[connectionId]/node-state/forward/[incomingChannelId]/[incomingHtlcId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/forward/[incomingChannelId=stringSegment]/[incomingHtlcId=nonNegativeBigInt]',
		mappings: [
			{
				id: 'BlockheadLightningForward.LocalNodeStateIncomingChannelIncomingHtlcId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/lightning/connection/[connectionId]/node-state/forward/[incomingChannelId]/[incomingHtlcId]:BlockheadLightningForward.LocalNodeStateIncomingChannelIncomingHtlcId'],
				probeCases: [[[0, '1', ['incomingChannelId', 'incomingHtlcId', 'connectionId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/lightning/connection/[connectionId]/node-state/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningNodeState_Timestamp.LocalNodeStateTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/lightning/connection/[connectionId]/node-state/observations/[timestampMs]/[source]:BlockheadLightningNodeState_Timestamp.LocalNodeStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/lightning/connection/[connectionId]/node-state/peer': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/peer',
		mappings: [
			{
				id: 'BlockheadLightningNodeState.ConnectionIdNetwork',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/lightning/connection/[connectionId]/node-state:BlockheadLightningNodeState.ConnectionIdNetwork'],
				probeCases: [[[0, '1', ['connectionId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/lightning/connection/[connectionId]/node-state/peer/[publicKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/peer/[publicKey=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningPeer.LocalNodeStatePublicKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/lightning/connection/[connectionId]/node-state/peer/[publicKey]:BlockheadLightningPeer.LocalNodeStatePublicKey'],
				probeCases: [[[0, '1', ['publicKey', 'connectionId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/~/lightning/connection/[connectionId]/node-state/peer/[publicKey]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/peer/[publicKey=stringSegment]/(blockheadLightningPeer)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningPeer_Timestamp.PeerTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/~/lightning/connection/[connectionId]/node-state/peer/[publicKey]/observations/[timestampMs]/[source]:BlockheadLightningPeer_Timestamp.PeerTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'publicKey', 'connectionId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/[accountAddress]/subaccount/[subaccountNumber]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]',
		mappings: [
			{
				id: 'DydxChainSubaccount.NetworkAccountSubaccountNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountAddress]/subaccount/[subaccountNumber]:DydxChainSubaccount.NetworkAccountSubaccountNumber'],
				probeCases: [[[0, '1', ['subaccountNumber', 'network', 'accountAddress']]]],
				projectionPath: [
					'Dydx',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/[accountAddress]/subaccount/[subaccountNumber]/market/[ticker]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]/(dydxChainSubaccount)/market/[ticker=stringSegment]',
		mappings: [
			{
				id: 'DydxChainPerpetualPosition.SubaccountMarket',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountAddress]/subaccount/[subaccountNumber]/market/[ticker]:DydxChainPerpetualPosition.SubaccountMarket'],
				probeCases: [[[0, '1', ['ticker', 'subaccountNumber', 'network', 'accountAddress']]]],
				projectionPath: [
					'Dydx',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/[accountAddress]/subaccount/[subaccountNumber]/order/[orderId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[accountAddress=stringSegment]/subaccount/[subaccountNumber=nonNegativeInteger]/(dydxChainSubaccount)/order/[orderId=stringSegment]',
		mappings: [
			{
				id: 'DydxChainOrder.SubaccountOrderId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountAddress]/subaccount/[subaccountNumber]/order/[orderId]:DydxChainOrder.SubaccountOrderId'],
				probeCases: [[[0, '1', ['orderId', 'subaccountNumber', 'network', 'accountAddress']]]],
				projectionPath: [
					'Dydx',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]',
		mappings: [
			{
				id: 'SuiAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[address]:SuiAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
			{
				id: 'TezosAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[address]:TezosAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
			{
				id: 'KaspaAddress.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[address]:KaspaAddress.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Kaspa',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/[address]/coin/[coinType]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/coin/[coinType=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'SuiCoinBalance_Timestamp.AccountCoinTypeTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[address]/coin/[coinType]/observations/[timestampMs]/[source]:SuiCoinBalance_Timestamp.AccountCoinTypeTimestampMsSource'],
				probeCases: [[[0, '1', ['coinType', 'timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/[address]/level/[level]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'TezosAccount_Timestamp.AccountLevelSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[address]/level/[level]/[source]:TezosAccount_Timestamp.AccountLevelSource'],
				probeCases: [[[0, '1', ['level', 'source', 'address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'KaspaAddress_Timestamp.AddressTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[address]/observations/[timestampMs]/[source]:KaspaAddress_Timestamp.AddressTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Kaspa',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/[address]/token/[contractAddress]/[tokenId]/level/[level]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/token/[contractAddress=stringSegment]/[tokenId=nonNegativeBigInt]/level/[level=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'TezosTokenBalance_Timestamp.AccountTokenLevelSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[address]/token/[contractAddress]/[tokenId]/level/[level]/[source]:TezosTokenBalance_Timestamp.AccountTokenLevelSource'],
				probeCases: [[[0, '1', ['level', 'source', 'contractAddress', 'tokenId', 'address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/[address]/utxo/[outpointTransactionId]/[outpointIndex]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/utxo/[outpointTransactionId=stringSegment]/[outpointIndex=nonNegativeInteger]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'KaspaAddressUtxo_Timestamp.AddressOutpointTransactionIdOutpointIndexTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[address]/utxo/[outpointTransactionId]/[outpointIndex]/observations/[timestampMs]/[source]:KaspaAddressUtxo_Timestamp.AddressOutpointTransactionIdOutpointIndexTimestampMsSource'],
				probeCases: [[[0, '1', ['outpointTransactionId', 'outpointIndex', 'timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Kaspa',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/stellar/[accountId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]',
		mappings: [
			{
				id: 'StellarAccount.NetworkAccountId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/stellar/[accountId]:StellarAccount.NetworkAccountId'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/stellar/[accountId]/asset/[assetKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/asset/[assetKey=stringSegment]',
		mappings: [
			{
				id: 'StellarTrustline.AccountAsset',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/stellar/[accountId]/asset/[assetKey]:StellarTrustline.AccountAsset'],
				probeCases: [[[0, '1', ['assetKey', 'accountId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/stellar/[accountId]/asset/[assetKey]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/asset/[assetKey=stringSegment]/(stellarTrustline)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'StellarTrustline_Timestamp.TrustlineTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/stellar/[accountId]/asset/[assetKey]/observations/[timestampMs]/[source]:StellarTrustline_Timestamp.TrustlineTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'assetKey', 'accountId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/stellar/[accountId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'StellarAccount_Timestamp.AccountTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/stellar/[accountId]/observations/[timestampMs]/[source]:StellarAccount_Timestamp.AccountTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'accountId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/stellar/[accountId]/signer/[signerKey]/[signerType]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/signer/[signerKey=stringSegment]/[signerType=stringSegment]',
		mappings: [
			{
				id: 'StellarAccountSigner.AccountSignerKeySignerType',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/stellar/[accountId]/signer/[signerKey]/[signerType]:StellarAccountSigner.AccountSignerKeySignerType'],
				probeCases: [[[0, '1', ['signerKey', 'signerType', 'accountId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/account/stellar/[accountId]/signer/[signerKey]/[signerType]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/signer/[signerKey=stringSegment]/[signerType=stringSegment]/(stellarAccountSigner)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'StellarAccountSigner_Timestamp.SignerTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/stellar/[accountId]/signer/[signerKey]/[signerType]/observations/[timestampMs]/[source]:StellarAccountSigner_Timestamp.SignerTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'signerKey', 'signerType', 'accountId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/asset/[assetKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/asset/[assetKey=stringSegment]',
		mappings: [
			{
				id: 'StellarAsset.NetworkAssetKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/asset/[assetKey]:StellarAsset.NetworkAssetKey'],
				probeCases: [[[0, '1', ['assetKey', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/asset/[assetKind]:[assetId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/asset/[assetKind=stringSegment]:[assetId=stringSegment]',
		mappings: [
			{
				id: 'PolkadotAsset.NetworkAssetKindAssetId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/asset/[assetKind]:[assetId]:PolkadotAsset.NetworkAssetKindAssetId'],
				probeCases: [[[0, '1', ['assetKind', 'assetId', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/baker/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baker/[address=stringSegment]',
		mappings: [
			{
				id: 'TezosBaker.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/baker/[address]:TezosBaker.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/baker/[address]/cycle/[cycle]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baker/[address=stringSegment]/(tezosBaker)/cycle/[cycle=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'TezosBaker_Cycle_Timestamp.BakerCycleSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/baker/[address]/cycle/[cycle]/[source]:TezosBaker_Cycle_Timestamp.BakerCycleSource'],
				probeCases: [[[0, '1', ['cycle', 'source', 'address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/baker/[address]/level/[level]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baker/[address=stringSegment]/(tezosBaker)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'TezosBaker_Timestamp.BakerLevelSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/baker/[address]/level/[level]/[source]:TezosBaker_Timestamp.BakerLevelSource'],
				probeCases: [[[0, '1', ['level', 'source', 'address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/baking-right/[cycle]/[level]/[rightKind]/[bakerAddress]/[rightSource]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baking-right/[cycle=nonNegativeBigInt]/[level=nonNegativeBigInt]/[rightKind=stringSegment]/[bakerAddress=stringSegment]/[rightSource=stringSegment]',
		mappings: [
			{
				id: 'TezosBakingRight.NetworkCycleLevelRightKindBakerAddressSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/baking-right/[cycle]/[level]/[rightKind]/[bakerAddress]/[rightSource]:TezosBakingRight.NetworkCycleLevelRightKindBakerAddressSource'],
				probeCases: [[[0, '1', ['cycle', 'level', 'rightKind', 'bakerAddress', 'rightSource', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/baking-right/[cycle]/[level]/[rightKind]/[bakerAddress]/[rightSource]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baking-right/[cycle=nonNegativeBigInt]/[level=nonNegativeBigInt]/[rightKind=stringSegment]/[bakerAddress=stringSegment]/[rightSource=stringSegment]/(tezosBakingRight)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TezosBakingRight_Timestamp.RightTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/baking-right/[cycle]/[level]/[rightKind]/[bakerAddress]/[rightSource]/observations/[timestampMs]/[source]:TezosBakingRight_Timestamp.RightTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'cycle', 'level', 'rightKind', 'bakerAddress', 'rightSource', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/block/[blockHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/[blockHash=stringSegment]',
		mappings: [
			{
				id: 'KaspaBlock.NetworkBlockHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockHash]:KaspaBlock.NetworkBlockHash'],
				probeCases: [[[0, '1', ['blockHash', 'network']]]],
				projectionPath: [
					'Kaspa',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/block/[blockHash]/accepted-transaction/[transactionId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/[blockHash=stringSegment]/(kaspaBlock)/accepted-transaction/[transactionId=stringSegment]',
		mappings: [
			{
				id: 'KaspaAcceptedTransaction.AcceptingBlockTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockHash]/accepted-transaction/[transactionId]:KaspaAcceptedTransaction.AcceptingBlockTransaction'],
				probeCases: [[[0, '1', ['transactionId', 'blockHash', 'network']]]],
				projectionPath: [
					'Kaspa',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/block/hash/starknet/[blockHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/hash/starknet/[blockHash=stringSegment]',
		mappings: [
			{
				id: 'StarknetBlock.NetworkBlockHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/hash/starknet/[blockHash]:StarknetBlock.NetworkBlockHash'],
				probeCases: [[[0, '1', ['blockHash', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/block/hash/tezos/[hash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/hash/tezos/[hash=stringSegment]',
		mappings: [
			{
				id: 'TezosBlock.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/hash/tezos/[hash]:TezosBlock.NetworkHash'],
				probeCases: [[[0, '1', ['hash', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/block/height/[height]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/height/[height=nonNegativeBigInt]',
		mappings: [
			{
				id: 'AptosBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/height/[height]:AptosBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['height', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/block/level/[level]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/level/[level=nonNegativeBigInt]',
		mappings: [
			{
				id: 'TezosBlock.NetworkLevel',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/level/[level]:TezosBlock.NetworkLevel'],
				probeCases: [[[0, '1', ['level', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/block/number/[blockNumber]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/number/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'StarknetBlock.NetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/number/[blockNumber]:StarknetBlock.NetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/block/version/[version]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/version/[version=nonNegativeBigInt]',
		mappings: [
			{
				id: 'AptosBlock.NetworkVersion',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/version/[version]:AptosBlock.NetworkVersion'],
				probeCases: [[[0, '1', ['version', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/borrow-lend/reserve/[tokenIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/borrow-lend/reserve/[tokenIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'HyperliquidBorrowLendReserve.NetworkTokenIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/borrow-lend/reserve/[tokenIndex]:HyperliquidBorrowLendReserve.NetworkTokenIndex'],
				probeCases: [[[0, '1', ['tokenIndex', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]',
		mappings: [
			{
				id: 'IcpCanister.NetworkCanisterId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]:IcpCanister.NetworkCanisterId'],
				probeCases: [[[0, '1', ['canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/certified-state/[certificateHash]/[pathHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/certified-state/[certificateHash=stringSegment]/[pathHash=stringSegment]',
		mappings: [
			{
				id: 'IcpCertifiedState.CanisterCertificateHashPathHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/certified-state/[certificateHash]/[pathHash]:IcpCertifiedState.CanisterCertificateHashPathHash'],
				probeCases: [[[0, '1', ['certificateHash', 'pathHash', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/ledger': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger',
		mappings: [
			{
				id: 'IcpLedgerCanister.Canister',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/ledger:IcpLedgerCanister.Canister'],
				probeCases: [[[0, '1', ['canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/ledger/account/[owner]/[subaccount]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger/(icpLedgerCanister)/account/[owner=stringSegment]/[subaccount=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'IcpLedgerAccount_Timestamp.LedgerOwnerSubaccountTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/ledger/account/[owner]/[subaccount]/observations/[timestampMs]/[source]:IcpLedgerAccount_Timestamp.LedgerOwnerSubaccountTimestampMsSource'],
				probeCases: [[[0, '1', ['owner', 'subaccount', 'timestampMs', 'source', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/ledger/block/[blockIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger/(icpLedgerCanister)/block/[blockIndex=nonNegativeBigInt]',
		mappings: [
			{
				id: 'IcpLedgerBlock.LedgerBlockIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/ledger/block/[blockIndex]:IcpLedgerBlock.LedgerBlockIndex'],
				probeCases: [[[0, '1', ['blockIndex', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/ledger/block/[blockIndex]/transaction/[transactionIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger/(icpLedgerCanister)/block/[blockIndex=nonNegativeBigInt]/(icpLedgerBlock)/transaction/[transactionIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'IcpLedgerTransaction.BlockTransactionIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/ledger/block/[blockIndex]/transaction/[transactionIndex]:IcpLedgerTransaction.BlockTransactionIndex'],
				probeCases: [[[0, '1', ['transactionIndex', 'blockIndex', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/ledger/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger/(icpLedgerCanister)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'IcpLedgerCanister_Timestamp.LedgerTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/ledger/observations/[timestampMs]/[source]:IcpLedgerCanister_Timestamp.LedgerTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/log/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/log/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'IcpCanisterLog_Timestamp.CanisterTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/log/observations/[timestampMs]/[source]:IcpCanisterLog_Timestamp.CanisterTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/metadata/[metadataName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/metadata/[metadataName=stringSegment]',
		mappings: [
			{
				id: 'IcpCanisterMetadata.CanisterMetadataName',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/metadata/[metadataName]:IcpCanisterMetadata.CanisterMetadataName'],
				probeCases: [[[0, '1', ['metadataName', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/metadata/[metadataName]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/metadata/[metadataName=stringSegment]/(icpCanisterMetadata)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'IcpCanisterMetadata_Timestamp.MetadataTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/metadata/[metadataName]/observations/[timestampMs]/[source]:IcpCanisterMetadata_Timestamp.MetadataTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'metadataName', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/method/[methodName]/[methodKind]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/method/[methodName=stringSegment]/[methodKind=stringSegment]',
		mappings: [
			{
				id: 'IcpCanisterMethod.CanisterMethodNameMethodKind',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/method/[methodName]/[methodKind]:IcpCanisterMethod.CanisterMethodNameMethodKind'],
				probeCases: [[[0, '1', ['methodName', 'methodKind', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/method/[methodName]/[methodKind]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/method/[methodName=stringSegment]/[methodKind=stringSegment]/(icpCanisterMethod)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'IcpCanisterMethod_Timestamp.MethodTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/method/[methodName]/[methodKind]/observations/[timestampMs]/[source]:IcpCanisterMethod_Timestamp.MethodTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'methodName', 'methodKind', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/canister/[canisterId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'IcpCanister_Timestamp.CanisterTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/canister/[canisterId]/observations/[timestampMs]/[source]:IcpCanister_Timestamp.CanisterTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'canisterId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/claimable-balance/[claimableBalanceId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/claimable-balance/[claimableBalanceId=stringSegment]',
		mappings: [
			{
				id: 'StellarClaimableBalance.NetworkClaimableBalanceId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/claimable-balance/[claimableBalanceId]:StellarClaimableBalance.NetworkClaimableBalanceId'],
				probeCases: [[[0, '1', ['claimableBalanceId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/claimable-balance/[claimableBalanceId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/claimable-balance/[claimableBalanceId=stringSegment]/(stellarClaimableBalance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'StellarClaimableBalance_Timestamp.ClaimableBalanceTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/claimable-balance/[claimableBalanceId]/observations/[timestampMs]/[source]:StellarClaimableBalance_Timestamp.ClaimableBalanceTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'claimableBalanceId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/class/[classHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/class/[classHash=stringSegment]',
		mappings: [
			{
				id: 'StarknetClass.NetworkClassHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/class/[classHash]:StarknetClass.NetworkClassHash'],
				probeCases: [[[0, '1', ['classHash', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/coin-type/[coinType]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/coin-type/[coinType=stringSegment]',
		mappings: [
			{
				id: 'SuiCoinType.NetworkCoinType',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/coin-type/[coinType]:SuiCoinType.NetworkCoinType'],
				probeCases: [[[0, '1', ['coinType', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/coin-type/[coinType]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/coin-type/[coinType=stringSegment]/(suiCoinType)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'SuiRegulatedCoinState_Timestamp.CoinTypeTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/coin-type/[coinType]/observations/[timestampMs]/[source]:SuiRegulatedCoinState_Timestamp.CoinTypeTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'coinType', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/consensus-network/[consensusNetworkId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/consensus-network/[consensusNetworkId=stringSegment]',
		mappings: [
			{
				id: 'ZeroGConsensusNetwork.NetworkConsensusNetworkId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/consensus-network/[consensusNetworkId]:ZeroGConsensusNetwork.NetworkConsensusNetworkId'],
				probeCases: [[[0, '1', ['consensusNetworkId', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/contract/tezos/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]',
		mappings: [
			{
				id: 'TezosContract.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/tezos/[address]:TezosContract.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/contract/tezos/[address]/big-map/[bigMapId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/big-map/[bigMapId=nonNegativeBigInt]',
		mappings: [
			{
				id: 'TezosBigMap.ContractBigMapId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/tezos/[address]/big-map/[bigMapId]:TezosBigMap.ContractBigMapId'],
				probeCases: [[[0, '1', ['bigMapId', 'address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/contract/tezos/[address]/big-map/[bigMapId]/key/[keyHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/big-map/[bigMapId=nonNegativeBigInt]/(tezosBigMap)/key/[keyHash=stringSegment]',
		mappings: [
			{
				id: 'TezosBigMapKey.BigMapKeyHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/tezos/[address]/big-map/[bigMapId]/key/[keyHash]:TezosBigMapKey.BigMapKeyHash'],
				probeCases: [[[0, '1', ['keyHash', 'bigMapId', 'address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/contract/tezos/[address]/big-map/[bigMapId]/key/[keyHash]/level/[level]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/big-map/[bigMapId=nonNegativeBigInt]/(tezosBigMap)/key/[keyHash=stringSegment]/(tezosBigMapKey)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'TezosBigMapKey_Timestamp.BigMapKeyLevelSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/tezos/[address]/big-map/[bigMapId]/key/[keyHash]/level/[level]/[source]:TezosBigMapKey_Timestamp.BigMapKeyLevelSource'],
				probeCases: [[[0, '1', ['level', 'source', 'keyHash', 'bigMapId', 'address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/contract/tezos/[address]/big-map/[bigMapId]/level/[level]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/big-map/[bigMapId=nonNegativeBigInt]/(tezosBigMap)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'TezosBigMap_Timestamp.BigMapLevelSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/tezos/[address]/big-map/[bigMapId]/level/[level]/[source]:TezosBigMap_Timestamp.BigMapLevelSource'],
				probeCases: [[[0, '1', ['level', 'source', 'bigMapId', 'address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/contract/tezos/[address]/entrypoint/[entrypointName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/entrypoint/[entrypointName=stringSegment]',
		mappings: [
			{
				id: 'TezosEntrypoint.ContractEntrypointName',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/tezos/[address]/entrypoint/[entrypointName]:TezosEntrypoint.ContractEntrypointName'],
				probeCases: [[[0, '1', ['entrypointName', 'address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/contract/tezos/[address]/level/[level]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'TezosContract_Timestamp.ContractLevelSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/tezos/[address]/level/[level]/[source]:TezosContract_Timestamp.ContractLevelSource'],
				probeCases: [[[0, '1', ['level', 'source', 'address', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/cycle/[cycle]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/cycle/[cycle=nonNegativeBigInt]',
		mappings: [
			{
				id: 'TezosCycle.NetworkCycle',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/cycle/[cycle]:TezosCycle.NetworkCycle'],
				probeCases: [[[0, '1', ['cycle', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/da-node/[nodeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/da-node/[nodeId=stringSegment]',
		mappings: [
			{
				id: 'ZeroGDaNode.NetworkNodeId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/da-node/[nodeId]:ZeroGDaNode.NetworkNodeId'],
				probeCases: [[[0, '1', ['nodeId', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/da-quorum/[quorumId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/da-quorum/[quorumId=stringSegment]',
		mappings: [
			{
				id: 'ZeroGDaQuorum.NetworkQuorumId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/da-quorum/[quorumId]:ZeroGDaQuorum.NetworkQuorumId'],
				probeCases: [[[0, '1', ['quorumId', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/data-blob/[dataRoot]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/data-blob/[dataRoot=stringSegment]',
		mappings: [
			{
				id: 'ZeroGDataBlob.NetworkDataRoot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/data-blob/[dataRoot]:ZeroGDataBlob.NetworkDataRoot'],
				probeCases: [[[0, '1', ['dataRoot', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/data-blob/[dataRoot]/chunk/[chunkIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/data-blob/[dataRoot=stringSegment]/(zeroGDataBlob)/chunk/[chunkIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'ZeroGDataChunk.ZeroGDataBlobChunkIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/data-blob/[dataRoot]/chunk/[chunkIndex]:ZeroGDataChunk.ZeroGDataBlobChunkIndex'],
				probeCases: [[[0, '1', ['chunkIndex', 'dataRoot', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/effect/stellar/[effectId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/effect/stellar/[effectId=stringSegment]',
		mappings: [
			{
				id: 'StellarEffect.NetworkEffectId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/effect/stellar/[effectId]:StellarEffect.NetworkEffectId'],
				probeCases: [[[0, '1', ['effectId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/exchange-rate/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/exchange-rate/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaNetworkExchangeRate_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/exchange-rate/observations/[timestampMs]/[source]:HederaNetworkExchangeRate_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/fee/[transactionType]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/fee/[transactionType=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaNetworkFee_Timestamp.NetworkTransactionTypeTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/fee/[transactionType]/observations/[timestampMs]/[source]:HederaNetworkFee_Timestamp.NetworkTransactionTypeTimestampMsSource'],
				probeCases: [[[0, '1', ['transactionType', 'timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/frame/[frameNumber]/[shardKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/frame/[frameNumber=nonNegativeBigInt]/[shardKey=stringSegment]',
		mappings: [
			{
				id: 'QuilibriumFrame.NetworkFrameNumberShardKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/frame/[frameNumber]/[shardKey]:QuilibriumFrame.NetworkFrameNumberShardKey'],
				probeCases: [[[0, '1', ['frameNumber', 'shardKey', 'network']]]],
				projectionPath: [
					'Quilibrium',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/ibc/denom-trace/[traceKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/ibc/denom-trace/[traceKey=stringSegment]',
		mappings: [
			{
				id: 'IbcDenomTrace.NetworkTraceKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/ibc/denom-trace/[traceKey]:IbcDenomTrace.NetworkTraceKey'],
				probeCases: [[[0, '1', ['traceKey', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/kv/[namespace]/[key]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/kv/[namespace=stringSegment]/[key=stringSegment]',
		mappings: [
			{
				id: 'ZeroGKvEntry.NetworkNamespaceKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/kv/[namespace]/[key]:ZeroGKvEntry.NetworkNamespaceKey'],
				probeCases: [[[0, '1', ['namespace', 'key', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/ledger/stellar/[sequence]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/ledger/stellar/[sequence=nonNegativeBigInt]',
		mappings: [
			{
				id: 'StellarLedger.NetworkSequence',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/ledger/stellar/[sequence]:StellarLedger.NetworkSequence'],
				probeCases: [[[0, '1', ['sequence', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/liquidity-pool/[liquidityPoolId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/liquidity-pool/[liquidityPoolId=stringSegment]',
		mappings: [
			{
				id: 'StellarLiquidityPool.NetworkLiquidityPoolId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/liquidity-pool/[liquidityPoolId]:StellarLiquidityPool.NetworkLiquidityPoolId'],
				probeCases: [[[0, '1', ['liquidityPoolId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/liquidity-pool/[liquidityPoolId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/liquidity-pool/[liquidityPoolId=stringSegment]/(stellarLiquidityPool)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'StellarLiquidityPool_Timestamp.LiquidityPoolTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/liquidity-pool/[liquidityPoolId]/observations/[timestampMs]/[source]:StellarLiquidityPool_Timestamp.LiquidityPoolTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'liquidityPoolId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/market/[marketKey]/interval/[intervalValue]/[intervalUnit]/observations/[timestampMs]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/market/[marketKey=stringSegment]/interval/[intervalValue=nonNegativeInteger]/[intervalUnit=stringSegment]/observations/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'HyperliquidMarket_TimeInterval_Timestamp.NetworkMarketKeyTimeIntervalTimestampMs',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/market/[marketKey]/interval/[intervalValue]/[intervalUnit]/observations/[timestampMs]:HyperliquidMarket_TimeInterval_Timestamp.NetworkMarketKeyTimeIntervalTimestampMs'],
				probeCases: [[[0, '1', ['marketKey', 'timestampMs', 'intervalValue', 'intervalUnit', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/object/[objectId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/object/[objectId=stringSegment]',
		mappings: [
			{
				id: 'SuiObject.NetworkObjectId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/object/[objectId]:SuiObject.NetworkObjectId'],
				probeCases: [[[0, '1', ['objectId', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/object/[objectId]/dynamic-field/[fieldNameHash]/[childObjectId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/object/[objectId=stringSegment]/(suiObject)/dynamic-field/[fieldNameHash=stringSegment]/[childObjectId=stringSegment]',
		mappings: [
			{
				id: 'SuiDynamicFieldEdge.ParentObjectFieldNameHashChildObjectId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/object/[objectId]/dynamic-field/[fieldNameHash]/[childObjectId]:SuiDynamicFieldEdge.ParentObjectFieldNameHashChildObjectId'],
				probeCases: [[[0, '1', ['fieldNameHash', 'childObjectId', 'objectId', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/object/[objectId]/dynamic-field/[fieldNameHash]/[childObjectId]/checkpoint/[checkpointSequence]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/object/[objectId=stringSegment]/(suiObject)/dynamic-field/[fieldNameHash=stringSegment]/[childObjectId=stringSegment]/(suiDynamicFieldEdge)/checkpoint/[checkpointSequence=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'SuiDynamicFieldEdge_Timestamp.EdgeCheckpointSequenceSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/object/[objectId]/dynamic-field/[fieldNameHash]/[childObjectId]/checkpoint/[checkpointSequence]/[source]:SuiDynamicFieldEdge_Timestamp.EdgeCheckpointSequenceSource'],
				probeCases: [[[0, '1', ['checkpointSequence', 'source', 'fieldNameHash', 'childObjectId', 'objectId', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/object/[objectId]/version/[version]/[digest]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/object/[objectId=stringSegment]/(suiObject)/version/[version=nonNegativeBigInt]/[digest=stringSegment]',
		mappings: [
			{
				id: 'SuiObjectVersion.NetworkObjectIdVersionDigest',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/object/[objectId]/version/[version]/[digest]:SuiObjectVersion.NetworkObjectIdVersionDigest'],
				probeCases: [[[0, '1', ['objectId', 'version', 'digest', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/observations/[ledgerVersion]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/observations/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AptosNetwork_Timestamp.NetworkLedgerVersionSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[ledgerVersion]/[source]:AptosNetwork_Timestamp.NetworkLedgerVersionSource'],
				probeCases: [[[0, '1', ['ledgerVersion', 'source', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/offer/[offerId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/offer/[offerId=stringSegment]',
		mappings: [
			{
				id: 'StellarOffer.NetworkOfferId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/offer/[offerId]:StellarOffer.NetworkOfferId'],
				probeCases: [[[0, '1', ['offerId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/offer/[offerId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/offer/[offerId=stringSegment]/(stellarOffer)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'StellarOffer_Timestamp.OfferTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/offer/[offerId]/observations/[timestampMs]/[source]:StellarOffer_Timestamp.OfferTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'offerId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/operation-group/[operationHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/operation-group/[operationHash=stringSegment]',
		mappings: [
			{
				id: 'TezosOperationGroup.NetworkOperationHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/operation-group/[operationHash]:TezosOperationGroup.NetworkOperationHash'],
				probeCases: [[[0, '1', ['operationHash', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/operation-group/[operationHash]/operation/[contentIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/operation-group/[operationHash=stringSegment]/(tezosOperationGroup)/operation/[contentIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'TezosOperation.OperationGroupContentIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/operation-group/[operationHash]/operation/[contentIndex]:TezosOperation.OperationGroupContentIndex'],
				probeCases: [[[0, '1', ['contentIndex', 'operationHash', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/operation-group/[operationHash]/operation/[contentIndex]/big-map/[bigMapId]/[keyHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/operation-group/[operationHash=stringSegment]/(tezosOperationGroup)/operation/[contentIndex=nonNegativeInteger]/(tezosOperation)/big-map/[bigMapId=nonNegativeBigInt]/[keyHash=stringSegment]',
		mappings: [
			{
				id: 'TezosBigMapDiff.OperationBigMapIdKeyHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/operation-group/[operationHash]/operation/[contentIndex]/big-map/[bigMapId]/[keyHash]:TezosBigMapDiff.OperationBigMapIdKeyHash'],
				probeCases: [[[0, '1', ['bigMapId', 'keyHash', 'contentIndex', 'operationHash', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/operation-group/[operationHash]/operation/[contentIndex]/internal/[internalIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/operation-group/[operationHash=stringSegment]/(tezosOperationGroup)/operation/[contentIndex=nonNegativeInteger]/(tezosOperation)/internal/[internalIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'TezosInternalOperation.ParentOperationInternalIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/operation-group/[operationHash]/operation/[contentIndex]/internal/[internalIndex]:TezosInternalOperation.ParentOperationInternalIndex'],
				probeCases: [[[0, '1', ['internalIndex', 'contentIndex', 'operationHash', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/package/[originalPackageId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/package/[originalPackageId=stringSegment]',
		mappings: [
			{
				id: 'SuiPackage.NetworkOriginalPackageId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/package/[originalPackageId]:SuiPackage.NetworkOriginalPackageId'],
				probeCases: [[[0, '1', ['originalPackageId', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/package/[originalPackageId]/upgrade/[upgradedPackageId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/package/[originalPackageId=stringSegment]/(suiPackage)/upgrade/[upgradedPackageId=stringSegment]',
		mappings: [
			{
				id: 'SuiPackageUpgrade.PackageUpgradedPackageId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/package/[originalPackageId]/upgrade/[upgradedPackageId]:SuiPackageUpgrade.PackageUpgradedPackageId'],
				probeCases: [[[0, '1', ['upgradedPackageId', 'originalPackageId', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/package/[packageId]/version/[version]/[digest]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/package/[packageId=stringSegment]/version/[version=nonNegativeBigInt]/[digest=stringSegment]',
		mappings: [
			{
				id: 'SuiPackageVersion.NetworkPackageIdVersionDigest',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/package/[packageId]/version/[version]/[digest]:SuiPackageVersion.NetworkPackageIdVersionDigest'],
				probeCases: [[[0, '1', ['packageId', 'version', 'digest', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/prover/[proverPeerId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/prover/[proverPeerId=stringSegment]',
		mappings: [
			{
				id: 'QuilibriumProver.NetworkProverPeerId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/prover/[proverPeerId]:QuilibriumProver.NetworkProverPeerId'],
				probeCases: [[[0, '1', ['proverPeerId', 'network']]]],
				projectionPath: [
					'Quilibrium',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/request/[requestId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/request/[requestId=stringSegment]',
		mappings: [
			{
				id: 'IcpRequestStatus.NetworkRequestId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/request/[requestId]:IcpRequestStatus.NetworkRequestId'],
				probeCases: [[[0, '1', ['requestId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/request/[requestId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/request/[requestId=stringSegment]/(icpRequestStatus)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'IcpRequestStatus_Timestamp.RequestStatusTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/request/[requestId]/observations/[timestampMs]/[source]:IcpRequestStatus_Timestamp.RequestStatusTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'requestId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/script/[scriptHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/script/[scriptHash=stringSegment]',
		mappings: [
			{
				id: 'TezosMichelsonScript.NetworkScriptHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/script/[scriptHash]:TezosMichelsonScript.NetworkScriptHash'],
				probeCases: [[[0, '1', ['scriptHash', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/service-provider/[providerId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/service-provider/[providerId=stringSegment]',
		mappings: [
			{
				id: 'ZeroGServiceProvider.NetworkProviderId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/service-provider/[providerId]:ZeroGServiceProvider.NetworkProviderId'],
				probeCases: [[[0, '1', ['providerId', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/service-provider/[providerId]/request/[requestId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/service-provider/[providerId=stringSegment]/(zeroGServiceProvider)/request/[requestId=stringSegment]',
		mappings: [
			{
				id: 'ZeroGServiceRequest.ZeroGServiceProviderRequestId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/service-provider/[providerId]/request/[requestId]:ZeroGServiceRequest.ZeroGServiceProviderRequestId'],
				probeCases: [[[0, '1', ['requestId', 'providerId', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/service-provider/[providerId]/request/[requestId]/trace/[traceId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/service-provider/[providerId=stringSegment]/(zeroGServiceProvider)/request/[requestId=stringSegment]/(zeroGServiceRequest)/trace/[traceId=stringSegment]',
		mappings: [
			{
				id: 'ZeroGSettlementTrace.ZeroGServiceRequestTraceId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/service-provider/[providerId]/request/[requestId]/trace/[traceId]:ZeroGSettlementTrace.ZeroGServiceRequestTraceId'],
				probeCases: [[[0, '1', ['traceId', 'requestId', 'providerId', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/shard/[shardKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/shard/[shardKey=stringSegment]',
		mappings: [
			{
				id: 'QuilibriumShard.NetworkShardKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/shard/[shardKey]:QuilibriumShard.NetworkShardKey'],
				probeCases: [[[0, '1', ['shardKey', 'network']]]],
				projectionPath: [
					'Quilibrium',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/soroban/contract/[contractId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]',
		mappings: [
			{
				id: 'SorobanContract.NetworkContractId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/soroban/contract/[contractId]:SorobanContract.NetworkContractId'],
				probeCases: [[[0, '1', ['contractId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/soroban/contract/[contractId]/ledger/[ledgerSequence]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]/(sorobanContract)/ledger/[ledgerSequence=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'SorobanContract_Timestamp.ContractLedgerSequenceSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/soroban/contract/[contractId]/ledger/[ledgerSequence]/[source]:SorobanContract_Timestamp.ContractLedgerSequenceSource'],
				probeCases: [[[0, '1', ['ledgerSequence', 'source', 'contractId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/soroban/contract/[contractId]/storage/[keyHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]/(sorobanContract)/storage/[keyHash=stringSegment]',
		mappings: [
			{
				id: 'SorobanContractStorageEntry.ContractKeyHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/soroban/contract/[contractId]/storage/[keyHash]:SorobanContractStorageEntry.ContractKeyHash'],
				probeCases: [[[0, '1', ['keyHash', 'contractId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/soroban/contract/[contractId]/storage/[keyHash]/ledger/[ledgerSequence]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]/(sorobanContract)/storage/[keyHash=stringSegment]/(sorobanContractStorageEntry)/ledger/[ledgerSequence=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'SorobanContractStorageEntry_Timestamp.EntryLedgerSequenceSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/soroban/contract/[contractId]/storage/[keyHash]/ledger/[ledgerSequence]/[source]:SorobanContractStorageEntry_Timestamp.EntryLedgerSequenceSource'],
				probeCases: [[[0, '1', ['ledgerSequence', 'source', 'keyHash', 'contractId', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/soroban/wasm/[wasmHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/wasm/[wasmHash=stringSegment]',
		mappings: [
			{
				id: 'SorobanWasm.NetworkWasmHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/soroban/wasm/[wasmHash]:SorobanWasm.NetworkWasmHash'],
				probeCases: [[[0, '1', ['wasmHash', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/soroban/wasm/[wasmHash]/ledger/[ledgerSequence]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/wasm/[wasmHash=stringSegment]/(sorobanWasm)/ledger/[ledgerSequence=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'SorobanWasm_Timestamp.WasmLedgerSequenceSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/soroban/wasm/[wasmHash]/ledger/[ledgerSequence]/[source]:SorobanWasm_Timestamp.WasmLedgerSequenceSource'],
				probeCases: [[[0, '1', ['ledgerSequence', 'source', 'wasmHash', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/spot-asset/[assetId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/spot-asset/[assetId=nonNegativeInteger]',
		mappings: [
			{
				id: 'HyperliquidSpotAsset.NetworkAssetId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/spot-asset/[assetId]:HyperliquidSpotAsset.NetworkAssetId'],
				probeCases: [[[0, '1', ['assetId', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/spot-pair/[pairIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/spot-pair/[pairIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'HyperliquidSpotPair.NetworkPairIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/spot-pair/[pairIndex]:HyperliquidSpotPair.NetworkPairIndex'],
				probeCases: [[[0, '1', ['pairIndex', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/stake/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/stake/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaNetworkStake_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/stake/observations/[timestampMs]/[source]:HederaNetworkStake_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/storage-log/[logEntryId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/storage-log/[logEntryId=stringSegment]',
		mappings: [
			{
				id: 'ZeroGStorageLogEntry.NetworkLogEntryId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/storage-log/[logEntryId]:ZeroGStorageLogEntry.NetworkLogEntryId'],
				probeCases: [[[0, '1', ['logEntryId', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/storage-node/[nodeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/storage-node/[nodeId=evmAddress]',
		mappings: [
			{
				id: 'ZeroGStorageNode.NetworkNodeId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/storage-node/[nodeId]:ZeroGStorageNode.NetworkNodeId'],
				probeCases: [[[0, '1', ['nodeId', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/storage-node/[nodeId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/storage-node/[nodeId=evmAddress]/(zeroGStorageNode)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'ZeroGStorageNode_Timestamp.StorageNodeTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/storage-node/[nodeId]/observations/[timestampMs]/[source]:ZeroGStorageNode_Timestamp.StorageNodeTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'nodeId', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/storage-node/[nodeId]/proof/[proofId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/storage-node/[nodeId=evmAddress]/(zeroGStorageNode)/proof/[proofId=stringSegment]',
		mappings: [
			{
				id: 'ZeroGStorageProof.ZeroGStorageNodeProofId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/storage-node/[nodeId]/proof/[proofId]:ZeroGStorageProof.ZeroGStorageNodeProofId'],
				probeCases: [[[0, '1', ['proofId', 'nodeId', 'network']]]],
				projectionPath: [
					'ZeroG',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/subnet/[subnetId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/subnet/[subnetId=stringSegment]',
		mappings: [
			{
				id: 'IcpSubnet.NetworkSubnetId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/subnet/[subnetId]:IcpSubnet.NetworkSubnetId'],
				probeCases: [[[0, '1', ['subnetId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/subnet/[subnetId]/canister-range/[rangeStart]/[rangeEnd]/[registryVersion]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/subnet/[subnetId=stringSegment]/(icpSubnet)/canister-range/[rangeStart=stringSegment]/[rangeEnd=stringSegment]/[registryVersion=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'IcpSubnetCanisterRange_Timestamp.SubnetRangeStartRangeEndRegistryVersionSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/subnet/[subnetId]/canister-range/[rangeStart]/[rangeEnd]/[registryVersion]/[source]:IcpSubnetCanisterRange_Timestamp.SubnetRangeStartRangeEndRegistryVersionSource'],
				probeCases: [[[0, '1', ['rangeStart', 'rangeEnd', 'registryVersion', 'source', 'subnetId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/subnet/[subnetId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/subnet/[subnetId=stringSegment]/(icpSubnet)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'IcpSubnet_Timestamp.SubnetTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/subnet/[subnetId]/observations/[timestampMs]/[source]:IcpSubnet_Timestamp.SubnetTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'subnetId', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/supply/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/supply/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaNetworkSupply_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/supply/observations/[timestampMs]/[source]:HederaNetworkSupply_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/token-transfer/[transferId]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/token-transfer/[transferId=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'TezosTokenTransfer.NetworkTransferIdSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token-transfer/[transferId]/[source]:TezosTokenTransfer.NetworkTransferIdSource'],
				probeCases: [[[0, '1', ['transferId', 'source', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/token/[contractAddress]/[tokenId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/token/[contractAddress=stringSegment]/[tokenId=nonNegativeBigInt]',
		mappings: [
			{
				id: 'TezosToken.NetworkContractAddressTokenId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token/[contractAddress]/[tokenId]:TezosToken.NetworkContractAddressTokenId'],
				probeCases: [[[0, '1', ['contractAddress', 'tokenId', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/token/[contractAddress]/[tokenId]/level/[level]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/token/[contractAddress=stringSegment]/[tokenId=nonNegativeBigInt]/(tezosToken)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'TezosToken_Timestamp.TokenLevelSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token/[contractAddress]/[tokenId]/level/[level]/[source]:TezosToken_Timestamp.TokenLevelSource'],
				probeCases: [[[0, '1', ['level', 'source', 'contractAddress', 'tokenId', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/trade/[tradeId]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/trade/[tradeId=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'StellarTrade.NetworkTradeIdSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/trade/[tradeId]/[source]:StellarTrade.NetworkTradeIdSource'],
				probeCases: [[[0, '1', ['tradeId', 'source', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/transaction/[transactionDigest]/event/[eventIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/[transactionDigest=stringSegment]/event/[eventIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'SuiEvent.NetworkTransactionDigestEventIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/[transactionDigest]/event/[eventIndex]:SuiEvent.NetworkTransactionDigestEventIndex'],
				probeCases: [[[0, '1', ['transactionDigest', 'eventIndex', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/transaction/[transactionVersion]/event/[eventIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/[transactionVersion=nonNegativeBigInt]/event/[eventIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'AptosEvent.NetworkTransactionVersionEventIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/[transactionVersion]/event/[eventIndex]:AptosEvent.NetworkTransactionVersionEventIndex'],
				probeCases: [[[0, '1', ['transactionVersion', 'eventIndex', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/transaction/kaspa/[transactionId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/kaspa/[transactionId=stringSegment]',
		mappings: [
			{
				id: 'KaspaTransaction.NetworkTransactionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/kaspa/[transactionId]:KaspaTransaction.NetworkTransactionId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Kaspa',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/transaction/starknet/[transactionHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/starknet/[transactionHash=stringSegment]',
		mappings: [
			{
				id: 'StarknetTransaction.NetworkTransactionHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/starknet/[transactionHash]:StarknetTransaction.NetworkTransactionHash'],
				probeCases: [[[0, '1', ['transactionHash', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/transaction/starknet/[transactionHash]/event/[eventIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/starknet/[transactionHash=stringSegment]/(starknetTransaction)/event/[eventIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'StarknetEvent.TransactionEventIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/starknet/[transactionHash]/event/[eventIndex]:StarknetEvent.TransactionEventIndex'],
				probeCases: [[[0, '1', ['eventIndex', 'transactionHash', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/transaction/starknet/[transactionHash]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/starknet/[transactionHash=stringSegment]/(starknetTransaction)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'StarknetTransaction_Timestamp.TransactionTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/starknet/[transactionHash]/observations/[timestampMs]/[source]:StarknetTransaction_Timestamp.TransactionTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'transactionHash', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/transaction/stellar/[hash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/stellar/[hash=stringSegment]',
		mappings: [
			{
				id: 'StellarTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/stellar/[hash]:StellarTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['hash', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/transaction/stellar/[hash]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/stellar/[hash=stringSegment]/(stellarTransaction)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'StellarTransaction_Timestamp.TransactionTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/stellar/[hash]/observations/[timestampMs]/[source]:StellarTransaction_Timestamp.TransactionTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'hash', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/transaction/stellar/[hash]/operation/[operationIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/stellar/[hash=stringSegment]/(stellarTransaction)/operation/[operationIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'StellarOperation.TransactionOperationIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/stellar/[hash]/operation/[operationIndex]:StellarOperation.TransactionOperationIndex'],
				probeCases: [[[0, '1', ['operationIndex', 'hash', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/validator/hyperliquid/[validator]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/validator/hyperliquid/[validator=stringSegment]',
		mappings: [
			{
				id: 'HyperliquidValidator.NetworkValidator',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/hyperliquid/[validator]:HyperliquidValidator.NetworkValidator'],
				probeCases: [[[0, '1', ['validator', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/validator/polkadot/[stashAccountId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/validator/polkadot/[stashAccountId=stringSegment]',
		mappings: [
			{
				id: 'PolkadotValidator.NetworkStashAccountId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/polkadot/[stashAccountId]:PolkadotValidator.NetworkStashAccountId'],
				probeCases: [[[0, '1', ['stashAccountId', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/validator/polkadot/[stashAccountId]/era/[eraIndex]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/validator/polkadot/[stashAccountId=stringSegment]/(polkadotValidator)/era/[eraIndex=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'PolkadotValidator_Era.ValidatorEraIndexSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/polkadot/[stashAccountId]/era/[eraIndex]/[source]:PolkadotValidator_Era.ValidatorEraIndexSource'],
				probeCases: [[[0, '1', ['eraIndex', 'source', 'stashAccountId', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/vault/[vaultAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/vault/[vaultAddress=evmAddress]',
		mappings: [
			{
				id: 'HyperliquidVault.NetworkVaultAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/vault/[vaultAddress]:HyperliquidVault.NetworkVaultAddress'],
				probeCases: [[[0, '1', ['vaultAddress', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/vault/[vaultAddress]/equity/account/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/vault/[vaultAddress=evmAddress]/(hyperliquidVault)/equity/account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HyperliquidVaultEquity_Timestamp.AccountVaultTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/vault/[vaultAddress]/equity/account/[address]/observations/[timestampMs]/[source]:HyperliquidVaultEquity_Timestamp.AccountVaultTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'vaultAddress', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/vault/[vaultAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/vault/[vaultAddress=evmAddress]/(hyperliquidVault)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HyperliquidVault_Timestamp.VaultTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/vault/[vaultAddress]/observations/[timestampMs]/[source]:HyperliquidVault_Timestamp.VaultTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'vaultAddress', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(protocol-networks)/virtual-chain/[startHash]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/virtual-chain/[startHash=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'KaspaVirtualChain_Timestamp.NetworkStartHashTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/virtual-chain/[startHash]/observations/[timestampMs]/[source]:KaspaVirtualChain_Timestamp.NetworkStartHashTimestampMsSource'],
				probeCases: [[[0, '1', ['startHash', 'timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Kaspa',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(starknet)/state-update/[blockHash]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(starknet)/state-update/[blockHash=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'StarknetStateUpdate.NetworkBlockHashSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/state-update/[blockHash]/[source]:StarknetStateUpdate.NetworkBlockHashSource'],
				probeCases: [[[0, '1', ['blockHash', 'source', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/safe-tx/[safeTxHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/safe-tx/[safeTxHash=evmTxHash]',
		mappings: [
			{
				id: 'SafeMultisigTransaction.EvmNetworkSafeTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/safe-tx/[safeTxHash]:SafeMultisigTransaction.EvmNetworkSafeTxHash'],
				probeCases: [[[0, '1', ['safeTxHash', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'ArweaveTransaction.NetworkTransactionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:ArweaveTransaction.NetworkTransactionId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Arweave',
				],
			},
			{
				id: 'CosmosTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CosmosTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HyperliquidTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:HyperliquidTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
			{
				id: 'MoneroTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:MoneroTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Monero',
				],
			},
			{
				id: 'NearTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:NearTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
			{
				id: 'TronTransaction.NetworkTransactionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:TronTransaction.NetworkTransactionId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
			{
				id: 'AptosTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:AptosTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/action/[actionIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/action/[actionIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'NearAction.NearTransactionActionIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/action/[actionIndex]:NearAction.NearTransactionActionIndex'],
				probeCases: [[[0, '1', ['actionIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/authorization/[authorizationIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/authorization/[authorizationIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'Eip7702Authorization.TransactionAuthorizationIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/authorization/[authorizationIndex]:Eip7702Authorization.TransactionAuthorizationIndex'],
				probeCases: [[[0, '1', ['authorizationIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/bridge-transfer/[source]/[logIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/bridge-transfer/[source=stringSegment]/[logIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BridgeTransfer.SourceTxSourceLogIndex',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/bridge-transfer/[source]/[logIndex]:BridgeTransfer.SourceTxSourceLogIndex'],
				probeCases: [[[0, '1', ['source', 'logIndex', 'transactionId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/certificate/[certificateIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/certificate/[certificateIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'CardanoCertificate.TransactionCertificateIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/certificate/[certificateIndex]:CardanoCertificate.TransactionCertificateIndex'],
				probeCases: [[[0, '1', ['certificateIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/input/[inputIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/input/[inputIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'CardanoTxInput.TransactionInputIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/input/[inputIndex]:CardanoTxInput.TransactionInputIndex'],
				probeCases: [[[0, '1', ['inputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoInput.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/input/[inputIndex]:UtxoInput.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['inputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/inputs': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/inputs',
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'ArweaveTransaction.NetworkTransactionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:ArweaveTransaction.NetworkTransactionId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Arweave',
				],
			},
			{
				id: 'CosmosTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CosmosTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HyperliquidTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:HyperliquidTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
			{
				id: 'MoneroTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:MoneroTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Monero',
				],
			},
			{
				id: 'NearTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:NearTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
			{
				id: 'TronTransaction.NetworkTransactionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:TronTransaction.NetworkTransactionId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
			{
				id: 'AptosTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:AptosTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]',
		mappings: [
			{
				id: 'SolanaInstruction.SolanaTransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]:SolanaInstruction.SolanaTransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['instructionKind', 'indexInTransaction', 'transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/(solanaInstruction)/inner/[indexInInstruction=nonNegativeInteger]',
		mappings: [
			{
				id: 'SolanaInstruction.SolanaTransactionIndexInInstruction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]:SolanaInstruction.SolanaTransactionIndexInInstruction'],
				probeCases: [[[0, '1', ['instructionKind', 'indexInTransaction', 'indexInInstruction', 'transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/internal-transfer/[indexInTransaction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/internal-transfer/[indexInTransaction=nonNegativeInteger]',
		mappings: [
			{
				id: 'EvmInternalTransfer.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/internal-transfer/[indexInTransaction]:EvmInternalTransfer.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['indexInTransaction', 'transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/issuance/[inputIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/issuance/[inputIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'ElementsIssuance.UtxoTransactionInputIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/issuance/[inputIndex]:ElementsIssuance.UtxoTransactionInputIndex'],
				probeCases: [[[0, '1', ['inputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/key-image/[inputIndex]/[keyImage]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/key-image/[inputIndex=nonNegativeInteger]/[keyImage=stringSegment]',
		mappings: [
			{
				id: 'MoneroKeyImage.MoneroTransactionInputIndexKeyImage',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/key-image/[inputIndex]/[keyImage]:MoneroKeyImage.MoneroTransactionInputIndexKeyImage'],
				probeCases: [[[0, '1', ['keyImage', 'inputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Monero',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/key-image/[inputIndex]/[keyImage]/ring': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/key-image/[inputIndex=nonNegativeInteger]/[keyImage=stringSegment]/(moneroKeyImage)/ring',
		mappings: [
			{
				id: 'MoneroRing.MoneroKeyImage',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/key-image/[inputIndex]/[keyImage]/ring:MoneroRing.MoneroKeyImage'],
				probeCases: [[[0, '1', ['keyImage', 'inputIndex', 'transactionId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/key-image/[inputIndex]/[keyImage]/ring/member/[memberIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/key-image/[inputIndex=nonNegativeInteger]/[keyImage=stringSegment]/(moneroKeyImage)/ring/(moneroRing)/member/[memberIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'MoneroRingMember.MoneroRingMemberIndex',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/key-image/[inputIndex]/[keyImage]/ring/member/[memberIndex]:MoneroRingMember.MoneroRingMemberIndex'],
				probeCases: [[[0, '1', ['memberIndex', 'keyImage', 'inputIndex', 'transactionId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/log/[indexInTransaction=nonNegativeInteger]',
		mappings: [
			{
				id: 'EvmLog.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/log/[indexInTransaction]:EvmLog.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['indexInTransaction', 'transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]/token-approval': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-approval',
		mappings: [
			{
				id: 'EvmTokenApproval.Log',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/log/[indexInTransaction]/token-approval:EvmTokenApproval.Log'],
				probeCases: [[[0, '1', ['indexInTransaction', 'transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'EvmTokenTransfer.LogIndexInLog',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]:EvmTokenTransfer.LogIndexInLog'],
				probeCases: [[[0, '1', ['transferIndex', 'indexInTransaction', 'transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/message/[indexInTransaction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/message/[indexInTransaction=nonNegativeInteger]',
		mappings: [
			{
				id: 'CosmosMessage.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/message/[indexInTransaction]:CosmosMessage.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['indexInTransaction', 'transactionId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/nonce/[nonce]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/nonce/[nonce=nonNegativeInteger]',
		mappings: [
			{
				id: 'HederaTransaction.NetworkTransactionIdNonce',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/nonce/[nonce]:HederaTransaction.NetworkTransactionIdNonce'],
				probeCases: [[[0, '1', ['transactionId', 'nonce', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/observations/[slot]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/observations/[slot=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'SolanaTransaction_Timestamp.TransactionSlotSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/observations/[slot]/[source]:SolanaTransaction_Timestamp.TransactionSlotSource'],
				probeCases: [[[0, '1', ['source', 'slot', 'transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/outcome/[outcomeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/outcome/[outcomeId=stringSegment]',
		mappings: [
			{
				id: 'NearExecutionOutcome.NearTransactionOutcomeId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/outcome/[outcomeId]:NearExecutionOutcome.NearTransactionOutcomeId'],
				probeCases: [[[0, '1', ['outcomeId', 'transactionId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'CardanoTxOutput.TransactionOutputIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/output/[outputIndex]:CardanoTxOutput.TransactionOutputIndex'],
				probeCases: [[[0, '1', ['outputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoOutput.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/output/[outputIndex]:UtxoOutput.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['outputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/asset/[policyId]/[assetName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/asset/[policyId=stringSegment]/[assetName=stringSegment]',
		mappings: [
			{
				id: 'CardanoTxOutputAsset.OutputAsset',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/output/[outputIndex]/asset/[policyId]/[assetName]:CardanoTxOutputAsset.OutputAsset'],
				probeCases: [[[0, '1', ['policyId', 'assetName', 'outputIndex', 'transactionId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/cash-token-commitment': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/cash-token-commitment',
		mappings: [
			{
				id: 'BitcoinCashCashTokenCommitment.UtxoOutput',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/output/[outputIndex]/cash-token-commitment:BitcoinCashCashTokenCommitment.UtxoOutput'],
				probeCases: [[[0, '1', ['outputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/cash-token-fungible': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/cash-token-fungible',
		mappings: [
			{
				id: 'BitcoinCashCashTokenFungibleAmount.UtxoOutput',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/output/[outputIndex]/cash-token-fungible:BitcoinCashCashTokenFungibleAmount.UtxoOutput'],
				probeCases: [[[0, '1', ['outputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/cash-token-nft': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/cash-token-nft',
		mappings: [
			{
				id: 'BitcoinCashCashTokenNft.UtxoOutput',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/output/[outputIndex]/cash-token-nft:BitcoinCashCashTokenNft.UtxoOutput'],
				probeCases: [[[0, '1', ['outputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]/rune/[runeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/rune/[runeId=stringSegment]',
		mappings: [
			{
				id: 'BitcoinRuneBalance.UtxoOutputRune',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/output/[outputIndex]/rune/[runeId]:BitcoinRuneBalance.UtxoOutputRune'],
				probeCases: [[[0, '1', ['runeId', 'outputIndex', 'transactionId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/outputs': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/outputs',
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'ArweaveTransaction.NetworkTransactionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:ArweaveTransaction.NetworkTransactionId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Arweave',
				],
			},
			{
				id: 'CosmosTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CosmosTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HyperliquidTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:HyperliquidTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
			{
				id: 'MoneroTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:MoneroTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Monero',
				],
			},
			{
				id: 'NearTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:NearTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
			{
				id: 'TronTransaction.NetworkTransactionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:TronTransaction.NetworkTransactionId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
			{
				id: 'AptosTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:AptosTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/receipt': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/receipt',
		mappings: [
			{
				id: 'TronTransactionReceipt.Transaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/receipt:TronTransactionReceipt.Transaction'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/runestone/[outputIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/runestone/[outputIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BitcoinRunestone.TransactionOutputIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/runestone/[outputIndex]:BitcoinRunestone.TransactionOutputIndex'],
				probeCases: [[[0, '1', ['outputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]:ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction'],
				probeCases: [[[0, '1', ['pool', 'actionKind', 'actionIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Zcash',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-actions': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/shielded-actions',
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'ArweaveTransaction.NetworkTransactionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:ArweaveTransaction.NetworkTransactionId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Arweave',
				],
			},
			{
				id: 'CosmosTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CosmosTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HyperliquidTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:HyperliquidTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
			{
				id: 'MoneroTransaction.NetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:MoneroTransaction.NetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Monero',
				],
			},
			{
				id: 'NearTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:NearTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
			{
				id: 'TronTransaction.NetworkTransactionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:TronTransaction.NetworkTransactionId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
			{
				id: 'AptosTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:AptosTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/signer/[signerAccountId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/signer/[signerAccountId=stringSegment]',
		mappings: [
			{
				id: 'NearTransaction.NetworkHashSignerAccountId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/signer/[signerAccountId]:NearTransaction.NetworkHashSignerAccountId'],
				probeCases: [[[0, '1', ['transactionId', 'signerAccountId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/state-change/[stateChangeKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/state-change/[stateChangeKey=stringSegment]',
		parameterEncodingByName: {
			stateChangeKey: 'Opaque',
		},
		mappings: [
			{
				id: 'EvmStateChange.TransactionStateChangeKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/state-change/[stateChangeKey]:EvmStateChange.TransactionStateChangeKey'],
				probeCases: [[[0, '1', ['stateChangeKey', 'transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/stealth-output/[outputIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/stealth-output/[outputIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'MoneroStealthOutput.MoneroTransactionOutputIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/stealth-output/[outputIndex]:MoneroStealthOutput.MoneroTransactionOutputIndex'],
				probeCases: [[[0, '1', ['outputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Monero',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/trace/[traceAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/trace/[traceAddress=stringSegment]',
		mappings: [
			{
				id: 'EvmTrace.TransactionTraceAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/trace/[traceAddress]:EvmTrace.TransactionTraceAddress'],
				probeCases: [[[0, '1', ['traceAddress', 'transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/witness/[witnessIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/witness/[witnessIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'CardanoScriptWitness.TransactionWitnessIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/witness/[witnessIndex]:CardanoScriptWitness.TransactionWitnessIndex'],
				probeCases: [[[0, '1', ['witnessIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/consensus/[consensusTimestamp]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]',
		mappings: [
			{
				id: 'HederaTransaction.NetworkConsensusTimestamp',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/consensus/[consensusTimestamp]:HederaTransaction.NetworkConsensusTimestamp'],
				probeCases: [[[0, '1', ['consensusTimestamp', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/consensus/[consensusTimestamp]/contract-result': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/contract-result',
		mappings: [
			{
				id: 'HederaContractResult.Transaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/consensus/[consensusTimestamp]/contract-result:HederaContractResult.Transaction'],
				probeCases: [[[0, '1', ['consensusTimestamp', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/consensus/[consensusTimestamp]/contract-result/action/[callDepth]/[callIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/contract-result/(hederaContractResult)/action/[callDepth=nonNegativeInteger]/[callIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'HederaContractAction.ResultCallDepthCallIndex',
				probeAtomPrefixes: ['/network/[network]/tx/consensus/[consensusTimestamp]/contract-result/action/[callDepth]/[callIndex]:HederaContractAction.ResultCallDepthCallIndex'],
				probeCases: [[[0, '1', ['callDepth', 'callIndex', 'consensusTimestamp', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/consensus/[consensusTimestamp]/contract-result/log/[logIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/contract-result/(hederaContractResult)/log/[logIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'HederaContractLog.ResultLogIndex',
				probeAtomPrefixes: ['/network/[network]/tx/consensus/[consensusTimestamp]/contract-result/log/[logIndex]:HederaContractLog.ResultLogIndex'],
				probeCases: [[[0, '1', ['logIndex', 'consensusTimestamp', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/consensus/[consensusTimestamp]/hbar-transfer/[accountId]/[transferIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/hbar-transfer/[accountId=stringSegment]/[transferIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'HederaHbarTransfer.TransactionAccountIdTransferIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/consensus/[consensusTimestamp]/hbar-transfer/[accountId]/[transferIndex]:HederaHbarTransfer.TransactionAccountIdTransferIndex'],
				probeCases: [[[0, '1', ['accountId', 'transferIndex', 'consensusTimestamp', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/consensus/[consensusTimestamp]/token-transfer/[tokenId]/[accountId]/[transferIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/token-transfer/[tokenId=stringSegment]/[accountId=stringSegment]/[transferIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'HederaTokenTransfer.TransactionTokenIdAccountIdTransferIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/consensus/[consensusTimestamp]/token-transfer/[tokenId]/[accountId]/[transferIndex]:HederaTokenTransfer.TransactionTokenIdAccountIdTransferIndex'],
				probeCases: [[[0, '1', ['tokenId', 'accountId', 'transferIndex', 'consensusTimestamp', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/version/[version]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/version/[version=nonNegativeBigInt]',
		mappings: [
			{
				id: 'AptosTransaction.NetworkVersion',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/version/[version]:AptosTransaction.NetworkVersion'],
				probeCases: [[[0, '1', ['version', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/version/[version]/observations/[ledgerVersion]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/version/[version=nonNegativeBigInt]/(aptosTransaction)/observations/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AptosTransaction_Timestamp.TransactionLedgerVersionSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/version/[version]/observations/[ledgerVersion]/[source]:AptosTransaction_Timestamp.TransactionLedgerVersionSource'],
				probeCases: [[[0, '1', ['source', 'ledgerVersion', 'version', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/version/[version]/state-change/[changeIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/version/[version=nonNegativeBigInt]/(aptosTransaction)/state-change/[changeIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'AptosStateChange.TransactionChangeIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/version/[version]/state-change/[changeIndex]:AptosStateChange.TransactionChangeIndex'],
				probeCases: [[[0, '1', ['changeIndex', 'version', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/consensus/[upgradeSlug]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/consensus/[upgradeSlug=stringSegment]',
		mappings: [
			{
				id: 'EthereumConsensusUpgrade.EvmNetworkSlug',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/consensus/[upgradeSlug]:EthereumConsensusUpgrade.EvmNetworkSlug'],
				probeCases: [[[0, '1', ['upgradeSlug', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/execution/[upgradeSlug]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/execution/[upgradeSlug=stringSegment]',
		mappings: [
			{
				id: 'EthereumExecutionUpgrade.EvmNetworkSlug',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/execution/[upgradeSlug]:EthereumExecutionUpgrade.EvmNetworkSlug'],
				probeCases: [[[0, '1', ['upgradeSlug', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/upgrade/[upgradeSlug]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/upgrade/[upgradeSlug=stringSegment]',
		mappings: [
			{
				id: 'EthereumNetworkUpgrade.EvmNetworkSlug',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/upgrade/[upgradeSlug]:EthereumNetworkUpgrade.EvmNetworkSlug'],
				probeCases: [[[0, '1', ['upgradeSlug', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/~/litecoin-mweb/wallet/[walletId]/state': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/litecoin-mweb/wallet/[walletId=stringSegment]/state',
		mappings: [
			{
				id: 'BlockheadLitecoinMwebWalletState.WalletIdNetwork',
				probeAtomPrefixes: ['/network/[network]/~/litecoin-mweb/wallet/[walletId]/state:BlockheadLitecoinMwebWalletState.WalletIdNetwork'],
				probeCases: [[[0, '1', ['walletId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/~/litecoin-mweb/wallet/[walletId]/state/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/litecoin-mweb/wallet/[walletId=stringSegment]/state/(blockheadLitecoinMwebWalletState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLitecoinMwebWalletState_Timestamp.WalletStateTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/~/litecoin-mweb/wallet/[walletId]/state/observations/[timestampMs]/[source]:BlockheadLitecoinMwebWalletState_Timestamp.WalletStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/~/quilibrium/connection/[connectionId]/account-state/[accountAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/account-state/[accountAddress=stringSegment]',
		mappings: [
			{
				id: 'BlockheadQuilibriumAccountState.ConnectionIdNetworkAccountAddress',
				probeAtomPrefixes: ['/network/[network]/~/quilibrium/connection/[connectionId]/account-state/[accountAddress]:BlockheadQuilibriumAccountState.ConnectionIdNetworkAccountAddress'],
				probeCases: [[[0, '1', ['connectionId', 'accountAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/~/quilibrium/connection/[connectionId]/account-state/[accountAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/account-state/[accountAddress=stringSegment]/(blockheadQuilibriumAccountState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadQuilibriumAccountState_Timestamp.AccountStateTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/~/quilibrium/connection/[connectionId]/account-state/[accountAddress]/observations/[timestampMs]/[source]:BlockheadQuilibriumAccountState_Timestamp.AccountStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId', 'accountAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/~/quilibrium/connection/[connectionId]/account-state/[accountAddress]/pending-transaction/[transactionAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/account-state/[accountAddress=stringSegment]/(blockheadQuilibriumAccountState)/pending-transaction/[transactionAddress=stringSegment]',
		mappings: [
			{
				id: 'BlockheadQuilibriumPendingTransaction.AccountStateTransactionAddress',
				probeAtomPrefixes: ['/network/[network]/~/quilibrium/connection/[connectionId]/account-state/[accountAddress]/pending-transaction/[transactionAddress]:BlockheadQuilibriumPendingTransaction.AccountStateTransactionAddress'],
				probeCases: [[[0, '1', ['transactionAddress', 'connectionId', 'accountAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/~/quilibrium/connection/[connectionId]/node-state': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/node-state',
		mappings: [
			{
				id: 'BlockheadQuilibriumNodeState.ConnectionIdNetwork',
				probeAtomPrefixes: ['/network/[network]/~/quilibrium/connection/[connectionId]/node-state:BlockheadQuilibriumNodeState.ConnectionIdNetwork'],
				probeCases: [[[0, '1', ['connectionId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/~/quilibrium/connection/[connectionId]/node-state/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/node-state/(blockheadQuilibriumNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadQuilibriumNodeState_Timestamp.NodeStateTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/~/quilibrium/connection/[connectionId]/node-state/observations/[timestampMs]/[source]:BlockheadQuilibriumNodeState_Timestamp.NodeStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/~/transfer-request/[id]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/transfer-request/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadTransferRequest.IdEvmNetwork',
				probeAtomPrefixes: ['/network/[network]/~/transfer-request/[id]:BlockheadTransferRequest.IdEvmNetwork'],
				probeCases: [[[0, '1', ['id', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/aave-market/[poolAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/aave-market/[poolAddress=evmAddress]',
		mappings: [
			{
				id: 'AaveMarket.NetworkPoolAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/aave-market/[poolAddress]:AaveMarket.NetworkPoolAddress'],
				probeCases: [[[0, '1', ['poolAddress', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/aave-market/[poolAddress]/reserve/[underlyingTokenAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/aave-market/[poolAddress=evmAddress]/(aaveMarket)/reserve/[underlyingTokenAddress=evmAddress]',
		mappings: [
			{
				id: 'AaveReserve.MarketUnderlyingTokenAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/aave-market/[poolAddress]/reserve/[underlyingTokenAddress]:AaveReserve.MarketUnderlyingTokenAddress'],
				probeCases: [[[0, '1', ['underlyingTokenAddress', 'poolAddress', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/accounts': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/accounts',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/activity/day/[dayStartTimestampMs]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/activity/day/[dayStartTimestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'Network_Activity_Day.NetworkDayStartTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/activity/day/[dayStartTimestampMs]:Network_Activity_Day.NetworkDayStartTimestampMsSource'],
				probeCases: [[[0, '1', ['dayStartTimestampMs', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/actor/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]',
		mappings: [
			{
				id: 'FilecoinActor.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/actor/[address]:FilecoinActor.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]/(filecoinActor)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'FilecoinActor_Timestamp.ActorHeightTipsetKeySource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]:FilecoinActor_Timestamp.ActorHeightTipsetKeySource'],
				probeCases: [[[0, '1', ['height', 'tipsetKey', 'source', 'address', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/address/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]',
		mappings: [
			{
				id: 'UtxoAddress.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/address/[address]:UtxoAddress.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/address/[address]/observations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations',
		mappings: [
			{
				id: 'UtxoAddress.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/address/[address]:UtxoAddress.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/address/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'UtxoAddress_Timestamp.AddressTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/address/[address]/observations/[timestampMs]/[source]:UtxoAddress_Timestamp.AddressTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/address/[address]/rune/[runeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/rune/[runeId=stringSegment]',
		mappings: [
			{
				id: 'BitcoinRuneBalance.UtxoAddressRune',
				probeAtomPrefixes: ['/network/[network]/address/[address]/rune/[runeId]:BitcoinRuneBalance.UtxoAddressRune'],
				probeCases: [[[0, '1', ['runeId', 'address', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/amendment/[amendmentId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amendment/[amendmentId=stringSegment]',
		mappings: [
			{
				id: 'XrplAmendment.NetworkAmendmentId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/amendment/[amendmentId]:XrplAmendment.NetworkAmendmentId'],
				probeCases: [[[0, '1', ['amendmentId', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/amendment/[amendmentId]/observations/[ledgerIndex]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amendment/[amendmentId=stringSegment]/(xrplAmendment)/observations/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'XrplAmendment_Timestamp.AmendmentLedgerIndexSource',
				probeAtomPrefixes: ['/network/[network]/amendment/[amendmentId]/observations/[ledgerIndex]/[source]:XrplAmendment_Timestamp.AmendmentLedgerIndexSource'],
				probeCases: [[[0, '1', ['source', 'ledgerIndex', 'amendmentId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/amm/[ammAccount]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amm/[ammAccount=stringSegment]',
		mappings: [
			{
				id: 'XrplAmm.NetworkAmmAccount',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/amm/[ammAccount]:XrplAmm.NetworkAmmAccount'],
				probeCases: [[[0, '1', ['ammAccount', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/amm/[ammAccount]/observations/[ledgerIndex]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amm/[ammAccount=stringSegment]/(xrplAmm)/observations/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'XrplAmm_Timestamp.AmmLedgerIndexSource',
				probeAtomPrefixes: ['/network/[network]/amm/[ammAccount]/observations/[ledgerIndex]/[source]:XrplAmm_Timestamp.AmmLedgerIndexSource'],
				probeCases: [[[0, '1', ['source', 'ledgerIndex', 'ammAccount', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]',
		mappings: [
			{
				id: 'AssetInstance.NetworkKindAssetKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]:AssetInstance.NetworkKindAssetKey'],
				probeCases: [[[0, '1', ['kind', 'assetKey', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/class/[classKind]/[classKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/class/[classKind=stringSegment]/[classKey=stringSegment]',
		mappings: [
			{
				id: 'AssetClass.AssetInstanceClassKindClassKey',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/class/[classKind]/[classKey]:AssetClass.AssetInstanceClassKindClassKey'],
				probeCases: [[[0, '1', ['classKind', 'classKey', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/collection': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/collection',
		mappings: [
			{
				id: 'NftCollection.AssetInstance',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/collection:NftCollection.AssetInstance'],
				probeCases: [[[0, '1', ['kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/collection/token/[tokenKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/collection/(nftCollection)/token/[tokenKey=stringSegment]',
		mappings: [
			{
				id: 'NftToken.CollectionTokenKey',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/collection/token/[tokenKey]:NftToken.CollectionTokenKey'],
				probeCases: [[[0, '1', ['tokenKey', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/eligibility/[namespace]/[reference]/[accountAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/eligibility/[namespace=stringSegment]/[reference=stringSegment]/[accountAddress=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AssetEligibility.AssetInstanceAccountTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/eligibility/[namespace]/[reference]/[accountAddress]/observations/[timestampMs]/[source]:AssetEligibility.AssetInstanceAccountTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'namespace', 'reference', 'accountAddress', 'timestampMs', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/extension/[extensionKind]/[extensionScope]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/extension/[extensionKind=stringSegment]/[extensionScope=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TokenProgramExtension_Timestamp.AssetInstanceExtensionKindExtensionScopeTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/extension/[extensionKind]/[extensionScope]/observations/[timestampMs]/[source]:TokenProgramExtension_Timestamp.AssetInstanceExtensionKindExtensionScopeTimestampMsSource'],
				probeCases: [[[0, '1', ['extensionKind', 'extensionScope', 'source', 'timestampMs', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/format/[formatId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/format/[formatId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AssetFormatSupport_Timestamp.AssetInstanceFormatIdTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/format/[formatId]/observations/[timestampMs]/[source]:AssetFormatSupport_Timestamp.AssetInstanceFormatIdTimestampMsSource'],
				probeCases: [[[0, '1', ['formatId', 'source', 'timestampMs', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/object/[objectKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/object/[objectKey=stringSegment]',
		mappings: [
			{
				id: 'AssetObject.AssetInstanceObjectKey',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/object/[objectKey]:AssetObject.AssetInstanceObjectKey'],
				probeCases: [[[0, '1', ['objectKey', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/regulated-profile': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile',
		mappings: [
			{
				id: 'RegulatedAssetProfile.AssetInstance',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/regulated-profile:RegulatedAssetProfile.AssetInstance'],
				probeCases: [[[0, '1', ['kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/regulated-profile/claim-topic/[topicKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/claim-topic/[topicKey=stringSegment]',
		mappings: [
			{
				id: 'ClaimTopicRequirement.ProfileTopicKey',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/regulated-profile/claim-topic/[topicKey]:ClaimTopicRequirement.ProfileTopicKey'],
				probeCases: [[[0, '1', ['topicKey', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/regulated-profile/compliance-module/[moduleKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/compliance-module/[moduleKey=stringSegment]',
		mappings: [
			{
				id: 'ComplianceModule.ProfileModuleKey',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/regulated-profile/compliance-module/[moduleKey]:ComplianceModule.ProfileModuleKey'],
				probeCases: [[[0, '1', ['moduleKey', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/regulated-profile/issuer/[issuerKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/issuer/[issuerKey=stringSegment]',
		mappings: [
			{
				id: 'TrustedIssuer.ProfileIssuerKey',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/regulated-profile/issuer/[issuerKey]:TrustedIssuer.ProfileIssuerKey'],
				probeCases: [[[0, '1', ['issuerKey', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/regulated-profile/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'RegulatedAssetProfile_Timestamp.ProfileTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/regulated-profile/observations/[timestampMs]/[source]:RegulatedAssetProfile_Timestamp.ProfileTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/regulated-profile/power/[powerKind]/[actorKey]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/power/[powerKind=stringSegment]/[actorKey=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'IssuerPower.ProfilePowerKindActorKeySource',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/regulated-profile/power/[powerKind]/[actorKey]/[source]:IssuerPower.ProfilePowerKindActorKeySource'],
				probeCases: [[[0, '1', ['powerKind', 'actorKey', 'source', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/restriction/[restrictionKey]/[restrictionSource]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/restriction/[restrictionKey=stringSegment]/[restrictionSource=stringSegment]',
		mappings: [
			{
				id: 'TransferRestriction.AssetInstanceRestrictionKeySource',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/restriction/[restrictionKey]/[restrictionSource]:TransferRestriction.AssetInstanceRestrictionKeySource'],
				probeCases: [[[0, '1', ['restrictionKey', 'restrictionSource', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/restriction/[restrictionKey]/[restrictionSource]/subject/[subjectKey]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/restriction/[restrictionKey=stringSegment]/[restrictionSource=stringSegment]/(transferRestriction)/subject/[subjectKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TransferRestrictionCheck_Timestamp.RestrictionTimestampMsSourceSubjectKey',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/restriction/[restrictionKey]/[restrictionSource]/subject/[subjectKey]/observations/[timestampMs]/[source]:TransferRestrictionCheck_Timestamp.RestrictionTimestampMsSourceSubjectKey'],
				probeCases: [[[0, '1', ['subjectKey', 'timestampMs', 'source', 'restrictionKey', 'restrictionSource', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/supply/[supplyScopeKey]/ledger/[ledgerCoordinateKind]/[ledgerCoordinateValue]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/supply/[supplyScopeKey=stringSegment]/ledger/[ledgerCoordinateKind=stringSegment]/[ledgerCoordinateValue=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'AssetSupply_LedgerCoordinate.AssetInstanceSupplyScopeKeyLedgerCoordinateKindLedgerCoordinateValueSource',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/supply/[supplyScopeKey]/ledger/[ledgerCoordinateKind]/[ledgerCoordinateValue]/[source]:AssetSupply_LedgerCoordinate.AssetInstanceSupplyScopeKeyLedgerCoordinateKindLedgerCoordinateValueSource'],
				probeCases: [[[0, '1', ['supplyScopeKey', 'ledgerCoordinateKind', 'source', 'ledgerCoordinateValue', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]/supply/[supplyScopeKey]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/supply/[supplyScopeKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AssetSupply_Timestamp.AssetInstanceSupplyScopeKeyTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]/supply/[supplyScopeKey]/observations/[timestampMs]/[source]:AssetSupply_Timestamp.AssetInstanceSupplyScopeKeyTimestampMsSource'],
				probeCases: [[[0, '1', ['supplyScopeKey', 'source', 'timestampMs', 'kind', 'assetKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/attestations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/attestations',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/avalanche-block-id/[blockId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/avalanche-block-id/[blockId=stringSegment]',
		mappings: [
			{
				id: 'AvalanchePChainBlock.NetworkBlockId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/avalanche-block-id/[blockId]:AvalanchePChainBlock.NetworkBlockId'],
				probeCases: [[[0, '1', ['blockId', 'network']]]],
				projectionPath: [
					'Avalanche',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/avalanche-block/[height]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/avalanche-block/[height=nonNegativeBigInt]',
		mappings: [
			{
				id: 'AvalanchePChainBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/avalanche-block/[height]:AvalanchePChainBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['height', 'network']]]],
				projectionPath: [
					'Avalanche',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/avalanche-tx/[txId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/avalanche-tx/[txId=stringSegment]',
		mappings: [
			{
				id: 'AvalanchePChainTransaction.NetworkTxId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/avalanche-tx/[txId]:AvalanchePChainTransaction.NetworkTxId'],
				probeCases: [[[0, '1', ['txId', 'network']]]],
				projectionPath: [
					'Avalanche',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/avalanche-tx/[txId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/avalanche-tx/[txId=stringSegment]/(avalanchePChainTransaction)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'AvalanchePChainTransaction_Timestamp.TransactionTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/avalanche-tx/[txId]/observations/[timestampMs]/[source]:AvalanchePChainTransaction_Timestamp.TransactionTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'txId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/balancer-gauge/[gaugeAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-gauge/[gaugeAddress=evmAddress]',
		mappings: [
			{
				id: 'BalancerGauge.NetworkGaugeAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/balancer-gauge/[gaugeAddress]:BalancerGauge.NetworkGaugeAddress'],
				probeCases: [[[0, '1', ['gaugeAddress', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/balancer-pool/[poolId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]',
		mappings: [
			{
				id: 'BalancerPool.NetworkPoolId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/balancer-pool/[poolId]:BalancerPool.NetworkPoolId'],
				probeCases: [[[0, '1', ['poolId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/balancer-pool/[poolId]/apr/[title]/[aprType]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]/(balancerPool)/apr/[title=stringSegment]/[aprType=stringSegment]',
		mappings: [
			{
				id: 'BalancerPoolAprItem.PoolTitleAprType',
				probeAtomPrefixes: ['/network/[network]/balancer-pool/[poolId]/apr/[title]/[aprType]:BalancerPoolAprItem.PoolTitleAprType'],
				probeCases: [[[0, '1', ['title', 'aprType', 'poolId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/balancer-pool/[poolId]/balance/[accountAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]/(balancerPool)/balance/[accountAddress=evmAddress]',
		mappings: [
			{
				id: 'BalancerAccountPoolBalance.AccountPool',
				probeAtomPrefixes: ['/network/[network]/balancer-pool/[poolId]/balance/[accountAddress]:BalancerAccountPoolBalance.AccountPool'],
				probeCases: [[[0, '1', ['accountAddress', 'poolId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/balancer-pool/[poolId]/event/[eventId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]/(balancerPool)/event/[eventId=stringSegment]',
		parameterEncodingByName: {
			eventId: 'Opaque',
		},
		mappings: [
			{
				id: 'BalancerPoolEvent.PoolEventId',
				probeAtomPrefixes: ['/network/[network]/balancer-pool/[poolId]/event/[eventId]:BalancerPoolEvent.PoolEventId'],
				probeCases: [[[0, '1', ['eventId', 'poolId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/balancer-pool/[poolId]/token/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]/(balancerPool)/token/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'BalancerPoolToken.PoolTokenIndex',
				probeAtomPrefixes: ['/network/[network]/balancer-pool/[poolId]/token/[index]:BalancerPoolToken.PoolTokenIndex'],
				probeCases: [[[0, '1', ['index', 'poolId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]',
		mappings: [
			{
				id: 'BeaconBlock.NetworkRoot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]:BeaconBlock.NetworkRoot'],
				probeCases: [[[0, '1', ['root', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/attestation/[indexInBlock]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/attestation/[indexInBlock=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconAttestation.BlockIndexInBlock',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/attestation/[indexInBlock]:BeaconAttestation.BlockIndexInBlock'],
				probeCases: [[[0, '1', ['indexInBlock', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/data-column/[columnIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/data-column/[columnIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconDataColumn.BlockColumnIndex',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/data-column/[columnIndex]:BeaconDataColumn.BlockColumnIndex'],
				probeCases: [[[0, '1', ['columnIndex', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/data-column/[columnIndex]/observation/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/data-column/[columnIndex=nonNegativeInteger]/(beaconDataColumn)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BeaconDataColumn_Timestamp.DataColumnTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/data-column/[columnIndex]/observation/[timestampMs]/[source]:BeaconDataColumn_Timestamp.DataColumnTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'columnIndex', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/deposit/[indexInBlock]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/deposit/[indexInBlock=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconDeposit.BlockIndexInBlock',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/deposit/[indexInBlock]:BeaconDeposit.BlockIndexInBlock'],
				probeCases: [[[0, '1', ['indexInBlock', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/execution-payload-bid': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-bid',
		mappings: [
			{
				id: 'BeaconExecutionPayloadBid.BeaconBlock',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/execution-payload-bid:BeaconExecutionPayloadBid.BeaconBlock'],
				probeCases: [[[0, '1', ['root', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/execution-payload-envelope': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope',
		mappings: [
			{
				id: 'BeaconExecutionPayloadEnvelope.BeaconBlock',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/execution-payload-envelope:BeaconExecutionPayloadEnvelope.BeaconBlock'],
				probeCases: [[[0, '1', ['root', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/execution-payload-envelope/consolidation-request/[indexInEnvelope]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope/(beaconExecutionPayloadEnvelope)/consolidation-request/[indexInEnvelope=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconExecutionConsolidationRequest.EnvelopeIndexInEnvelope',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/execution-payload-envelope/consolidation-request/[indexInEnvelope]:BeaconExecutionConsolidationRequest.EnvelopeIndexInEnvelope'],
				probeCases: [[[0, '1', ['indexInEnvelope', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/execution-payload-envelope/deposit-request/[requestIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope/(beaconExecutionPayloadEnvelope)/deposit-request/[requestIndex=nonNegativeBigInt]',
		mappings: [
			{
				id: 'BeaconExecutionDepositRequest.EnvelopeRequestIndex',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/execution-payload-envelope/deposit-request/[requestIndex]:BeaconExecutionDepositRequest.EnvelopeRequestIndex'],
				probeCases: [[[0, '1', ['requestIndex', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/execution-payload-envelope/observation/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope/(beaconExecutionPayloadEnvelope)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BeaconExecutionPayloadEnvelope_Timestamp.EnvelopeTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/execution-payload-envelope/observation/[timestampMs]/[source]:BeaconExecutionPayloadEnvelope_Timestamp.EnvelopeTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/execution-payload-envelope/withdrawal-request/[indexInEnvelope]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope/(beaconExecutionPayloadEnvelope)/withdrawal-request/[indexInEnvelope=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconExecutionWithdrawalRequest.EnvelopeIndexInEnvelope',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/execution-payload-envelope/withdrawal-request/[indexInEnvelope]:BeaconExecutionWithdrawalRequest.EnvelopeIndexInEnvelope'],
				probeCases: [[[0, '1', ['indexInEnvelope', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/observation/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BeaconBlock_Timestamp.BlockTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/observation/[timestampMs]/[source]:BeaconBlock_Timestamp.BlockTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/slashing/[kind]/[indexInKind]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/slashing/[kind=stringSegment]/[indexInKind=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconSlashing.BlockKindIndexInKind',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/slashing/[kind]/[indexInKind]:BeaconSlashing.BlockKindIndexInKind'],
				probeCases: [[[0, '1', ['kind', 'indexInKind', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/beacon-block/[root]/withdrawal/[withdrawalIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/withdrawal/[withdrawalIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconWithdrawal.BlockWithdrawalIndex',
				probeAtomPrefixes: ['/network/[network]/beacon-block/[root]/withdrawal/[withdrawalIndex]:BeaconWithdrawal.BlockWithdrawalIndex'],
				probeCases: [[[0, '1', ['withdrawalIndex', 'root', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/bitcoin-cash/metadata/[categoryId]/[registryUrl]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bitcoin-cash/metadata/[categoryId=stringSegment]/[registryUrl=stringSegment]',
		mappings: [
			{
				id: 'BitcoinCashBcmrMetadata.NetworkCategoryIdRegistryUrl',
				probeAtomPrefixes: ['/network/[network]/bitcoin-cash/metadata/[categoryId]/[registryUrl]:BitcoinCashBcmrMetadata.NetworkCategoryIdRegistryUrl'],
				probeCases: [[[0, '1', ['categoryId', 'registryUrl', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/blobs': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blobs',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/block-explorers': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block-explorers',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/block/[workchain]/[shardPrefix]/[seqno]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block/[workchain=integer]/[shardPrefix=stringSegment]/[seqno=nonNegativeBigInt]',
		mappings: [
			{
				id: 'TonBlock.NetworkWorkchainShardPrefixSeqno',
				probeAtomPrefixes: ['/network/[network]/block/[workchain]/[shardPrefix]/[seqno]:TonBlock.NetworkWorkchainShardPrefixSeqno'],
				probeCases: [[[0, '1', ['workchain', 'shardPrefix', 'seqno', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/block/hash/[rootHash]/[fileHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block/hash/[rootHash=stringSegment]/[fileHash=stringSegment]',
		mappings: [
			{
				id: 'TonBlock.NetworkRootHashFileHash',
				probeAtomPrefixes: ['/network/[network]/block/hash/[rootHash]/[fileHash]:TonBlock.NetworkRootHashFileHash'],
				probeCases: [[[0, '1', ['rootHash', 'fileHash', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/blocks': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blocks',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/bridges': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/bridges/[toCaip2]/[url]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]',
		parameterEncodingByName: {
			url: 'Opaque',
		},
		mappings: [
			{
				id: 'EvmNetworkBridge.FromToUrl',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/bridges/[toCaip2]/[url]:EvmNetworkBridge.FromToUrl'],
				probeCases: [[[0, '1', ['toCaip2', 'url', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/cash-token-category/[categoryId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/cash-token-category/[categoryId=stringSegment]',
		mappings: [
			{
				id: 'BitcoinCashCashTokenCategory.NetworkCategoryId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/cash-token-category/[categoryId]:BitcoinCashCashTokenCategory.NetworkCategoryId'],
				probeCases: [[[0, '1', ['categoryId', 'network']]]],
				projectionPath: [
					'CashTokens',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/channels': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/channels/[channelId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]',
		mappings: [
			{
				id: 'LightningChannel.NetworkChannelId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/channels/[channelId]:LightningChannel.NetworkChannelId'],
				probeCases: [[[0, '1', ['channelId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/channels/[channelId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]/(lightningChannel)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'LightningChannel_Timestamp.ChannelTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/channels/[channelId]/observations/[timestampMs]/[source]:LightningChannel_Timestamp.ChannelTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'channelId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/channels/[channelId]/observations/[timestampMs]/[source]/routing-policy/[publicKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]/(lightningChannel)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/(lightningChannelTimestamp)/routing-policy/[publicKey=stringSegment]',
		mappings: [
			{
				id: 'LightningChannelRoutingPolicy_Timestamp.ChannelTimestampTowardNode',
				probeAtomPrefixes: ['/network/[network]/channels/[channelId]/observations/[timestampMs]/[source]/routing-policy/[publicKey]:LightningChannelRoutingPolicy_Timestamp.ChannelTimestampTowardNode'],
				probeCases: [[[0, '1', ['publicKey', 'source', 'timestampMs', 'channelId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/chunk/[chunkHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/chunk/[chunkHash=stringSegment]',
		mappings: [
			{
				id: 'NearChunk.NetworkChunkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/chunk/[chunkHash]:NearChunk.NetworkChunkHash'],
				probeCases: [[[0, '1', ['chunkHash', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/committees': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/committees',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/compound-comet/[cometAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/compound-comet/[cometAddress=evmAddress]',
		mappings: [
			{
				id: 'CompoundComet.NetworkCometAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/compound-comet/[cometAddress]:CompoundComet.NetworkCometAddress'],
				probeCases: [[[0, '1', ['cometAddress', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/compound-comet/[cometAddress]/asset/[symbol]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/compound-comet/[cometAddress=evmAddress]/(compoundComet)/asset/[symbol=stringSegment]',
		mappings: [
			{
				id: 'CompoundCometAsset.CometAssetSymbol',
				probeAtomPrefixes: ['/network/[network]/compound-comet/[cometAddress]/asset/[symbol]:CompoundCometAsset.CometAssetSymbol'],
				probeCases: [[[0, '1', ['symbol', 'cometAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/compound-comet/[cometAddress]/position/[accountAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/compound-comet/[cometAddress=evmAddress]/(compoundComet)/position/[accountAddress=evmAddress]',
		mappings: [
			{
				id: 'CompoundPosition.AccountComet',
				probeAtomPrefixes: ['/network/[network]/compound-comet/[cometAddress]/position/[accountAddress]:CompoundPosition.AccountComet'],
				probeCases: [[[0, '1', ['accountAddress', 'cometAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/compound-comet/[cometAddress]/position/[accountAddress]/collateral/[symbol]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/compound-comet/[cometAddress=evmAddress]/(compoundComet)/position/[accountAddress=evmAddress]/(compoundPosition)/collateral/[symbol=stringSegment]',
		mappings: [
			{
				id: 'CompoundPositionCollateral.PositionAsset',
				probeAtomPrefixes: ['/network/[network]/compound-comet/[cometAddress]/position/[accountAddress]/collateral/[symbol]:CompoundPositionCollateral.PositionAsset'],
				probeCases: [[[0, '1', ['symbol', 'accountAddress', 'cometAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/contract/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contract/[address=stringSegment]',
		mappings: [
			{
				id: 'TronContract.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]:TronContract.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/contract/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contract/[address=stringSegment]/(tronContract)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TronContract_Timestamp.ContractTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/observations/[timestampMs]/[source]:TronContract_Timestamp.ContractTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/contracts': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contracts',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/cronos': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/cronos',
		mappings: [
			{
				id: 'CronosNetworkProfile.Network',
				probeAtomPrefixes: ['/network/[network]/cronos:CronosNetworkProfile.Network'],
				probeCases: [[[0, '1', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/curve-pool/[poolAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve-pool/[poolAddress=evmAddress]',
		mappings: [
			{
				id: 'CurvePool.NetworkPoolAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/curve-pool/[poolAddress]:CurvePool.NetworkPoolAddress'],
				probeCases: [[[0, '1', ['poolAddress', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/curve-pool/[poolAddress]/coin/[coinAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve-pool/[poolAddress=evmAddress]/(curvePool)/coin/[coinAddress=evmAddress]',
		mappings: [
			{
				id: 'CurvePoolCoin.PoolCoinAddress',
				probeAtomPrefixes: ['/network/[network]/curve-pool/[poolAddress]/coin/[coinAddress]:CurvePoolCoin.PoolCoinAddress'],
				probeCases: [[[0, '1', ['coinAddress', 'poolAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/curve/gauge/[gaugeAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve/gauge/[gaugeAddress=evmAddress]',
		mappings: [
			{
				id: 'CurveGauge.NetworkGaugeAddress',
				probeAtomPrefixes: ['/network/[network]/curve/gauge/[gaugeAddress]:CurveGauge.NetworkGaugeAddress'],
				probeCases: [[[0, '1', ['gaugeAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/curve/lending-vault/[vaultAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve/lending-vault/[vaultAddress=evmAddress]',
		mappings: [
			{
				id: 'CurveLendingVault.NetworkVaultAddress',
				probeAtomPrefixes: ['/network/[network]/curve/lending-vault/[vaultAddress]:CurveLendingVault.NetworkVaultAddress'],
				probeCases: [[[0, '1', ['vaultAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/deal/[dealId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/deal/[dealId=nonNegativeBigInt]',
		mappings: [
			{
				id: 'FilecoinDeal.NetworkDealId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/deal/[dealId]:FilecoinDeal.NetworkDealId'],
				probeCases: [[[0, '1', ['dealId', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/deal/[dealId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/deal/[dealId=nonNegativeBigInt]/(filecoinDeal)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'FilecoinDeal_Timestamp.DealTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/deal/[dealId]/observations/[timestampMs]/[source]:FilecoinDeal_Timestamp.DealTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'dealId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/denom/[denom]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/denom/[denom=stringSegment]',
		mappings: [
			{
				id: 'CosmosDenom.NetworkDenom',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/denom/[denom]:CosmosDenom.NetworkDenom'],
				probeCases: [[[0, '1', ['denom', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/drep/[drepCredential]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/drep/[drepCredential=stringSegment]',
		mappings: [
			{
				id: 'CardanoDRep.NetworkDrepCredential',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/drep/[drepCredential]:CardanoDRep.NetworkDrepCredential'],
				probeCases: [[[0, '1', ['drepCredential', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/drep/[drepCredential]/observations/[epoch]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/drep/[drepCredential=stringSegment]/(cardanoDRep)/observations/[epoch=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoDRep_Timestamp.DrepEpochSource',
				probeAtomPrefixes: ['/network/[network]/drep/[drepCredential]/observations/[epoch]/[source]:CardanoDRep_Timestamp.DrepEpochSource'],
				probeCases: [[[0, '1', ['source', 'epoch', 'drepCredential', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/eas/attestation/[uid]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eas/attestation/[uid=zeroExHex]',
		mappings: [
			{
				id: 'EasAttestation.NetworkUid',
				probeAtomPrefixes: ['/network/[network]/eas/attestation/[uid]:EasAttestation.NetworkUid'],
				probeCases: [[[0, '1', ['uid', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/eas/schema/[schemaUid]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eas/schema/[schemaUid=zeroExHex]',
		mappings: [
			{
				id: 'EasSchema.NetworkSchemaUid',
				probeAtomPrefixes: ['/network/[network]/eas/schema/[schemaUid]:EasSchema.NetworkSchemaUid'],
				probeCases: [[[0, '1', ['schemaUid', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/eigenlayer': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer',
		mappings: [
			{
				id: 'EigenLayerProtocol.Network',
				probeAtomPrefixes: ['/network/[network]/eigenlayer:EigenLayerProtocol.Network'],
				probeCases: [[[0, '1', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/eigenlayer/avs/[avsAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/avs/[avsAddress=evmAddress]',
		mappings: [
			{
				id: 'EigenLayerAvs.NetworkAvsAddress',
				probeAtomPrefixes: ['/network/[network]/eigenlayer/avs/[avsAddress]:EigenLayerAvs.NetworkAvsAddress'],
				probeCases: [[[0, '1', ['avsAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/eigenlayer/avs/[avsAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/avs/[avsAddress=evmAddress]/(eigenLayerAvs)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EigenLayerAvs_Timestamp.AvsTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/eigenlayer/avs/[avsAddress]/observations/[timestampMs]/[source]:EigenLayerAvs_Timestamp.AvsTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'avsAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/eigenlayer/operator/[operatorAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]',
		mappings: [
			{
				id: 'EigenLayerOperator.NetworkOperatorAddress',
				probeAtomPrefixes: ['/network/[network]/eigenlayer/operator/[operatorAddress]:EigenLayerOperator.NetworkOperatorAddress'],
				probeCases: [[[0, '1', ['operatorAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/eigenlayer/operator/[operatorAddress]/avs/[avsAddress]/slashing/[source]/[slashId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]/(eigenLayerOperator)/avs/[avsAddress=evmAddress]/slashing/[source=stringSegment]/[slashId=stringSegment]',
		mappings: [
			{
				id: 'EigenLayerSlashingEvent.OperatorAvsSourceSlashId',
				probeAtomPrefixes: ['/network/[network]/eigenlayer/operator/[operatorAddress]/avs/[avsAddress]/slashing/[source]/[slashId]:EigenLayerSlashingEvent.OperatorAvsSourceSlashId'],
				probeCases: [[[0, '1', ['source', 'slashId', 'avsAddress', 'operatorAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/eigenlayer/operator/[operatorAddress]/avs/[avsAddress]/strategy/[strategyAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]/(eigenLayerOperator)/avs/[avsAddress=evmAddress]/strategy/[strategyAddress=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EigenLayerAllocation_Timestamp.OperatorAvsStrategyTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/eigenlayer/operator/[operatorAddress]/avs/[avsAddress]/strategy/[strategyAddress]/observations/[timestampMs]/[source]:EigenLayerAllocation_Timestamp.OperatorAvsStrategyTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'avsAddress', 'strategyAddress', 'operatorAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/eigenlayer/operator/[operatorAddress]/delegation/staker/[stakerAddress]/strategy/[strategyAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]/(eigenLayerOperator)/delegation/staker/[stakerAddress=evmAddress]/strategy/[strategyAddress=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EigenLayerDelegation_Timestamp.StakerOperatorStrategyTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/eigenlayer/operator/[operatorAddress]/delegation/staker/[stakerAddress]/strategy/[strategyAddress]/observations/[timestampMs]/[source]:EigenLayerDelegation_Timestamp.StakerOperatorStrategyTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'stakerAddress', 'strategyAddress', 'operatorAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/eigenlayer/strategy/[strategyAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/strategy/[strategyAddress=evmAddress]',
		mappings: [
			{
				id: 'EigenLayerStrategy.NetworkStrategyAddress',
				probeAtomPrefixes: ['/network/[network]/eigenlayer/strategy/[strategyAddress]:EigenLayerStrategy.NetworkStrategyAddress'],
				probeCases: [[[0, '1', ['strategyAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/epoch/[epoch]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epoch/[epoch=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconEpoch.EvmNetworkEpoch',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/epoch/[epoch]:BeaconEpoch.EvmNetworkEpoch'],
				probeCases: [[[0, '1', ['epoch', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/epochs': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epochs',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-20-transfers': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-20-transfers',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factories': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factories',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]',
		mappings: [
			{
				id: 'Erc4337AccountFactory.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/account-factory/[address]:Erc4337AccountFactory.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]',
		mappings: [
			{
				id: 'Erc4337Bundler.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/bundler/[address]:Erc4337Bundler.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundlers': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundlers',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]',
		mappings: [
			{
				id: 'Erc4337Paymaster.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/paymaster/[address]:Erc4337Paymaster.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymasters': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymasters',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]',
		mappings: [
			{
				id: 'Erc4337SmartAccount.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/smart-account/[address]:Erc4337SmartAccount.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-accounts': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-accounts',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/user-operations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/user-operations',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ethereum/consensus-upgrade/[upgradeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ethereum/consensus-upgrade/[upgradeId=stringSegment]',
		mappings: [
			{
				id: 'EthereumConsensusUpgrade.EvmNetworkUpgradeId',
				probeAtomPrefixes: ['/network/[network]/ethereum/consensus-upgrade/[upgradeId]:EthereumConsensusUpgrade.EvmNetworkUpgradeId'],
				probeCases: [[[0, '1', ['upgradeId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ethereum/execution-upgrade/[upgradeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ethereum/execution-upgrade/[upgradeId=stringSegment]',
		mappings: [
			{
				id: 'EthereumExecutionUpgrade.EvmNetworkUpgradeId',
				probeAtomPrefixes: ['/network/[network]/ethereum/execution-upgrade/[upgradeId]:EthereumExecutionUpgrade.EvmNetworkUpgradeId'],
				probeCases: [[[0, '1', ['upgradeId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ethereum/upgrade/[upgradeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ethereum/upgrade/[upgradeId=stringSegment]',
		mappings: [
			{
				id: 'EthereumNetworkUpgrade.EvmNetworkUpgradeId',
				probeAtomPrefixes: ['/network/[network]/ethereum/upgrade/[upgradeId]:EthereumNetworkUpgrade.EvmNetworkUpgradeId'],
				probeCases: [[[0, '1', ['upgradeId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/euler/vault/[vaultAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/euler/vault/[vaultAddress=evmAddress]',
		mappings: [
			{
				id: 'EulerEvkVault.NetworkVaultAddress',
				probeAtomPrefixes: ['/network/[network]/euler/vault/[vaultAddress]:EulerEvkVault.NetworkVaultAddress'],
				probeCases: [[[0, '1', ['vaultAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/euler/vault/[vaultAddress]/position/[accountAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/euler/vault/[vaultAddress=evmAddress]/(eulerEvkVault)/position/[accountAddress=evmAddress]',
		mappings: [
			{
				id: 'EulerEvkVaultPosition.AccountVault',
				probeAtomPrefixes: ['/network/[network]/euler/vault/[vaultAddress]/position/[accountAddress]:EulerEvkVaultPosition.AccountVault'],
				probeCases: [[[0, '1', ['accountAddress', 'vaultAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/faucets': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/faucets',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/fee-market': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/fee-market/block/[blockNumber]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'EvmNetwork_GasFee_Block.EvmNetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/fee-market/block/[blockNumber]:EvmNetwork_GasFee_Block.EvmNetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/finality': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/finality/[timestampMs]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'EthereumBeaconFinality_Timestamp.EvmNetworkTimestampMs',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/finality/[timestampMs]:EthereumBeaconFinality_Timestamp.EvmNetworkTimestampMs'],
				probeCases: [[[0, '1', ['timestampMs', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/financial-protocol/[protocolKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/financial-protocol/[protocolKey=stringSegment]',
		mappings: [
			{
				id: 'FinancialProtocol.NetworkProtocolKey',
				probeAtomPrefixes: ['/network/[network]/financial-protocol/[protocolKey]:FinancialProtocol.NetworkProtocolKey'],
				probeCases: [[[0, '1', ['protocolKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/financial-protocol/[protocolKey]/amm-observation/[blockSelector]/[sourceRevision]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/financial-protocol/[protocolKey=stringSegment]/(financialProtocol)/amm-observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]',
		mappings: [
			{
				id: 'FinancialProtocol_Amm_EvmBlock.ProtocolBlockRevision',
				probeAtomPrefixes: ['/network/[network]/financial-protocol/[protocolKey]/amm-observation/[blockSelector]/[sourceRevision]:FinancialProtocol_Amm_EvmBlock.ProtocolBlockRevision'],
				probeCases: [[[0, '1', ['sourceRevision', 'blockSelector', 'protocolKey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/gas-estimates': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/gas-estimates/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmNetwork_GasEstimate_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/gas-estimates/[timestampMs]/[source]:EvmNetwork_GasEstimate_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/gmx/market/[marketTokenAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gmx/market/[marketTokenAddress=evmAddress]',
		mappings: [
			{
				id: 'GmxMarket.NetworkMarketTokenAddress',
				probeAtomPrefixes: ['/network/[network]/gmx/market/[marketTokenAddress]:GmxMarket.NetworkMarketTokenAddress'],
				probeCases: [[[0, '1', ['marketTokenAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/governance': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/governance/committee/epoch/[epoch]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoCommittee_Epoch.NetworkEpochSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/governance/committee/epoch/[epoch]/[source]:CardanoCommittee_Epoch.NetworkEpochSource'],
				probeCases: [[[0, '1', ['epoch', 'source', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/governance/constitution/[epoch]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/constitution/[epoch=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoConstitution_Epoch.NetworkEpochSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/governance/constitution/[epoch]/[source]:CardanoConstitution_Epoch.NetworkEpochSource'],
				probeCases: [[[0, '1', ['epoch', 'source', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/governance/proposal/[proposalId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalId=stringSegment]',
		mappings: [
			{
				id: 'CosmosGovernanceProposal.NetworkProposalId',
				probeAtomPrefixes: ['/network/[network]/governance/proposal/[proposalId]:CosmosGovernanceProposal.NetworkProposalId'],
				probeCases: [[[0, '1', ['proposalId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'CardanoGovernanceProposal.NetworkProposalTxHashProposalIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]:CardanoGovernanceProposal.NetworkProposalTxHashProposalIndex'],
				probeCases: [[[0, '1', ['proposalTxHash', 'proposalIndex', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]/observations/[epoch]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]/(cardanoGovernanceProposal)/observations/[epoch=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoGovernanceProposal_Timestamp.ProposalEpochSource',
				probeAtomPrefixes: ['/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]/observations/[epoch]/[source]:CardanoGovernanceProposal_Timestamp.ProposalEpochSource'],
				probeCases: [[[0, '1', ['source', 'epoch', 'proposalTxHash', 'proposalIndex', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]/vote/[voterKind]/[voterCredential]/[voteTxHash]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]/(cardanoGovernanceProposal)/vote/[voterKind=stringSegment]/[voterCredential=stringSegment]/[voteTxHash=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoGovernanceVote.ProposalVoterKindVoterCredentialVoteTxHashSource',
				probeAtomPrefixes: ['/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]/vote/[voterKind]/[voterCredential]/[voteTxHash]/[source]:CardanoGovernanceVote.ProposalVoterKindVoterCredentialVoteTxHashSource'],
				probeCases: [[[0, '1', ['voterKind', 'voterCredential', 'voteTxHash', 'source', 'proposalTxHash', 'proposalIndex', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ibc-channels': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-channels',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ibc-channels/[portId]/[channelId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-channels/[portId=stringSegment]/[channelId=stringSegment]',
		mappings: [
			{
				id: 'IbcChannel.NetworkPortIdChannelId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/ibc-channels/[portId]/[channelId]:IbcChannel.NetworkPortIdChannelId'],
				probeCases: [[[0, '1', ['portId', 'channelId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ibc-channels/[portId]/[channelId]/packet/[sequence]/[direction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-channels/[portId=stringSegment]/[channelId=stringSegment]/(ibcChannel)/packet/[sequence=nonNegativeBigInt]/[direction=stringSegment]',
		mappings: [
			{
				id: 'IbcPacket.ChannelSequenceDirection',
				probeAtomPrefixes: ['/network/[network]/ibc-channels/[portId]/[channelId]/packet/[sequence]/[direction]:IbcPacket.ChannelSequenceDirection'],
				probeCases: [[[0, '1', ['sequence', 'direction', 'portId', 'channelId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ibc-clients': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-clients',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ibc-clients/[clientId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-clients/[clientId=stringSegment]',
		mappings: [
			{
				id: 'IbcClient.NetworkClientId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/ibc-clients/[clientId]:IbcClient.NetworkClientId'],
				probeCases: [[[0, '1', ['clientId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ibc-connections': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-connections',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ibc-connections/[connectionId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ibc-connections/[connectionId=stringSegment]',
		mappings: [
			{
				id: 'IbcConnection.NetworkConnectionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/ibc-connections/[connectionId]:IbcConnection.NetworkConnectionId'],
				probeCases: [[[0, '1', ['connectionId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/inscription/[inscriptionId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/inscription/[inscriptionId=stringSegment]',
		mappings: [
			{
				id: 'BitcoinOrdinalInscription.NetworkInscriptionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/inscription/[inscriptionId]:BitcoinOrdinalInscription.NetworkInscriptionId'],
				probeCases: [[[0, '1', ['inscriptionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/invoices': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/invoices/[paymentHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices/[paymentHash=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningInvoice.NetworkPaymentHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/invoices/[paymentHash]:BlockheadLightningInvoice.NetworkPaymentHash'],
				probeCases: [[[0, '1', ['paymentHash', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/invoices/[paymentHash]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices/[paymentHash=stringSegment]/(blockheadLightningInvoice)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningInvoice_Timestamp.InvoiceTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/invoices/[paymentHash]/observations/[timestampMs]/[source]:BlockheadLightningInvoice_Timestamp.InvoiceTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'paymentHash', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/jetton-transfer/[transferId]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/jetton-transfer/[transferId=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'TonJettonTransfer.NetworkTransferIdSource',
				probeAtomPrefixes: ['/network/[network]/jetton-transfer/[transferId]/[source]:TonJettonTransfer.NetworkTransferIdSource'],
				probeCases: [[[0, '1', ['transferId', 'source', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/jetton/[masterAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/jetton/[masterAddress=stringSegment]',
		mappings: [
			{
				id: 'TonJetton.NetworkMasterAddress',
				probeAtomPrefixes: ['/network/[network]/jetton/[masterAddress]:TonJetton.NetworkMasterAddress'],
				probeCases: [[[0, '1', ['masterAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/jetton/[masterAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/jetton/[masterAddress=stringSegment]/(tonJetton)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TonJetton_Timestamp.JettonTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/jetton/[masterAddress]/observations/[timestampMs]/[source]:TonJetton_Timestamp.JettonTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'masterAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ledger/hash/[ledgerHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/hash/[ledgerHash=stringSegment]',
		mappings: [
			{
				id: 'XrplLedger.NetworkLedgerHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/ledger/hash/[ledgerHash]:XrplLedger.NetworkLedgerHash'],
				probeCases: [[[0, '1', ['ledgerHash', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ledger/hash/[ledgerHash]/entry/[entryHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/hash/[ledgerHash=stringSegment]/(xrplLedger)/entry/[entryHash=stringSegment]',
		mappings: [
			{
				id: 'XrplLedgerEntry.LedgerEntryHash',
				probeAtomPrefixes: ['/network/[network]/ledger/hash/[ledgerHash]/entry/[entryHash]:XrplLedgerEntry.LedgerEntryHash'],
				probeCases: [[[0, '1', ['entryHash', 'ledgerHash', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ledger/xrpl/[ledgerIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/xrpl/[ledgerIndex=nonNegativeBigInt]',
		mappings: [
			{
				id: 'XrplLedger.NetworkLedgerIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/ledger/xrpl/[ledgerIndex]:XrplLedger.NetworkLedgerIndex'],
				probeCases: [[[0, '1', ['ledgerIndex', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/leverage/[id]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/leverage/[id=stringSegment]',
		mappings: [
			{
				id: 'Leverage.EvmNetworkId',
				probeAtomPrefixes: ['/network/[network]/leverage/[id]:Leverage.EvmNetworkId'],
				probeCases: [[[0, '1', ['id', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/message/filecoin/[cid]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]',
		mappings: [
			{
				id: 'FilecoinMessage.NetworkCid',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/message/filecoin/[cid]:FilecoinMessage.NetworkCid'],
				probeCases: [[[0, '1', ['cid', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/message/filecoin/[cid]/event/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/event/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'FilecoinMessageEvent.MessageIndex',
				probeAtomPrefixes: ['/network/[network]/message/filecoin/[cid]/event/[index]:FilecoinMessageEvent.MessageIndex'],
				probeCases: [[[0, '1', ['index', 'cid', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/message/filecoin/[cid]/fee/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/fee/[source=stringSegment]',
		mappings: [
			{
				id: 'FilecoinMessageFee.MessageSource',
				probeAtomPrefixes: ['/network/[network]/message/filecoin/[cid]/fee/[source]:FilecoinMessageFee.MessageSource'],
				probeCases: [[[0, '1', ['source', 'cid', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/message/filecoin/[cid]/receipt/[tipsetKey]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/receipt/[tipsetKey=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'FilecoinMessageReceipt.MessageTipsetKeySource',
				probeAtomPrefixes: ['/network/[network]/message/filecoin/[cid]/receipt/[tipsetKey]/[source]:FilecoinMessageReceipt.MessageTipsetKeySource'],
				probeCases: [[[0, '1', ['tipsetKey', 'source', 'cid', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/message/filecoin/[cid]/subcall/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/subcall/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'FilecoinMessageSubcall.MessageIndex',
				probeAtomPrefixes: ['/network/[network]/message/filecoin/[cid]/subcall/[index]:FilecoinMessageSubcall.MessageIndex'],
				probeCases: [[[0, '1', ['index', 'cid', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/message/filecoin/[cid]/tipset/[height]/[tipsetKey]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/tipset/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'FilecoinMessage_Timestamp.MessageHeightTipsetKeySource',
				probeAtomPrefixes: ['/network/[network]/message/filecoin/[cid]/tipset/[height]/[tipsetKey]/[source]:FilecoinMessage_Timestamp.MessageHeightTipsetKeySource'],
				probeCases: [[[0, '1', ['height', 'tipsetKey', 'source', 'cid', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/message/filecoin/[cid]/token-transfer/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/token-transfer/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'FilecoinMessageTokenTransfer.MessageIndex',
				probeAtomPrefixes: ['/network/[network]/message/filecoin/[cid]/token-transfer/[index]:FilecoinMessageTokenTransfer.MessageIndex'],
				probeCases: [[[0, '1', ['index', 'cid', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/message/filecoin/[cid]/transfer/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/transfer/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'FilecoinMessageTransfer.MessageIndex',
				probeAtomPrefixes: ['/network/[network]/message/filecoin/[cid]/transfer/[index]:FilecoinMessageTransfer.MessageIndex'],
				probeCases: [[[0, '1', ['index', 'cid', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/message/ton/[messageHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/ton/[messageHash=stringSegment]',
		mappings: [
			{
				id: 'TonMessage.NetworkMessageHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/message/ton/[messageHash]:TonMessage.NetworkMessageHash'],
				probeCases: [[[0, '1', ['messageHash', 'network']]]],
				projectionPath: [
					'Ton',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/message/ton/[messageHash]/trace/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/ton/[messageHash=stringSegment]/(tonMessage)/trace/[source=stringSegment]',
		mappings: [
			{
				id: 'TonTrace.RootMessageSource',
				probeAtomPrefixes: ['/network/[network]/message/ton/[messageHash]/trace/[source]:TonTrace.RootMessageSource'],
				probeCases: [[[0, '1', ['source', 'messageHash', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]',
		mappings: [
			{
				id: 'MevBuilder.EvmNetworkBuilderPubkey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mev/builder/[builderPubkey]:MevBuilder.EvmNetworkBuilderPubkey'],
				probeCases: [[[0, '1', ['builderPubkey', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/builders': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builders',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/payloads': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payloads',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/received-bids': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/received-bids',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/relay/[host]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]',
		mappings: [
			{
				id: 'MevRelay.EvmNetworkHost',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mev/relay/[host]:MevRelay.EvmNetworkHost'],
				probeCases: [[[0, '1', ['host', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/relay/[host]/payload/[slot]/[blockHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/payload/[slot=nonNegativeInteger]/[blockHash=zeroExHex]',
		mappings: [
			{
				id: 'MevRelay_ProposerPayloadDelivered.RelaySlotBlockHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mev/relay/[host]/payload/[slot]/[blockHash]:MevRelay_ProposerPayloadDelivered.RelaySlotBlockHash'],
				probeCases: [[[0, '1', ['slot', 'blockHash', 'host', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/relay/[host]/received-bid/[slot]/[blockHash]/[builderPubkey]/[receivedAtMs]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/received-bid/[slot=nonNegativeInteger]/[blockHash=zeroExHex]/[builderPubkey=stringSegment]/[receivedAtMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'MevRelay_BuilderBlockReceived.RelaySlotBuilderBlockHashReceivedAtMs',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mev/relay/[host]/received-bid/[slot]/[blockHash]/[builderPubkey]/[receivedAtMs]:MevRelay_BuilderBlockReceived.RelaySlotBuilderBlockHashReceivedAtMs'],
				probeCases: [[[0, '1', ['slot', 'blockHash', 'receivedAtMs', 'builderPubkey', 'host', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/relays': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relays',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/miner/[minerAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]',
		mappings: [
			{
				id: 'FilecoinMiner.NetworkMinerAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/miner/[minerAddress]:FilecoinMiner.NetworkMinerAddress'],
				probeCases: [[[0, '1', ['minerAddress', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'FilecoinMiner_Timestamp.MinerHeightTipsetKeySource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]:FilecoinMiner_Timestamp.MinerHeightTipsetKeySource'],
				probeCases: [[[0, '1', ['height', 'tipsetKey', 'source', 'minerAddress', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/miner/[minerAddress]/sector/[sectorNumber]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/sector/[sectorNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'FilecoinSector.FilecoinMinerSectorNumber',
				probeAtomPrefixes: ['/network/[network]/miner/[minerAddress]/sector/[sectorNumber]:FilecoinSector.FilecoinMinerSectorNumber'],
				probeCases: [[[0, '1', ['sectorNumber', 'minerAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/miner/[minerAddress]/sector/[sectorNumber]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/sector/[sectorNumber=nonNegativeBigInt]/(filecoinSector)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'FilecoinSector_Timestamp.SectorTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/miner/[minerAddress]/sector/[sectorNumber]/observations/[timestampMs]/[source]:FilecoinSector_Timestamp.SectorTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'sectorNumber', 'minerAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mining-pool/[slug]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mining-pool/[slug=stringSegment]',
		mappings: [
			{
				id: 'BitcoinMiningPool.NetworkSlug',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mining-pool/[slug]:BitcoinMiningPool.NetworkSlug'],
				probeCases: [[[0, '1', ['slug', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mining-pool/[slug]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mining-pool/[slug=stringSegment]/(bitcoinMiningPool)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BitcoinMiningPool_Timestamp.PoolTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/mining-pool/[slug]/observations/[timestampMs]/[source]:BitcoinMiningPool_Timestamp.PoolTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'slug', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/module/[moduleName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/module/[moduleName=stringSegment]',
		mappings: [
			{
				id: 'CosmosModule.NetworkModuleName',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/module/[moduleName]:CosmosModule.NetworkModuleName'],
				probeCases: [[[0, '1', ['moduleName', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/morpho-market/[marketId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-market/[marketId=evmTxHash]',
		mappings: [
			{
				id: 'MorphoMarket.NetworkMarketId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/morpho-market/[marketId]:MorphoMarket.NetworkMarketId'],
				probeCases: [[[0, '1', ['marketId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/morpho-market/[marketId]/position/[accountAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-market/[marketId=evmTxHash]/(morphoMarket)/position/[accountAddress=evmAddress]',
		mappings: [
			{
				id: 'MorphoMarketPosition.AccountMarket',
				probeAtomPrefixes: ['/network/[network]/morpho-market/[marketId]/position/[accountAddress]:MorphoMarketPosition.AccountMarket'],
				probeCases: [[[0, '1', ['accountAddress', 'marketId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/morpho-vault/[vaultAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-vault/[vaultAddress=evmAddress]',
		mappings: [
			{
				id: 'MorphoVault.NetworkVaultAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/morpho-vault/[vaultAddress]:MorphoVault.NetworkVaultAddress'],
				probeCases: [[[0, '1', ['vaultAddress', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/morpho-vault/[vaultAddress]/position/[accountAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-vault/[vaultAddress=evmAddress]/(morphoVault)/position/[accountAddress=evmAddress]',
		mappings: [
			{
				id: 'MorphoVaultPosition.AccountVault',
				probeAtomPrefixes: ['/network/[network]/morpho-vault/[vaultAddress]/position/[accountAddress]:MorphoVaultPosition.AccountVault'],
				probeCases: [[[0, '1', ['accountAddress', 'vaultAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/move/module/[address]/[moduleName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]',
		mappings: [
			{
				id: 'MoveModule.NetworkAddressModuleName',
				probeAtomPrefixes: ['/network/[network]/move/module/[address]/[moduleName]:MoveModule.NetworkAddressModuleName'],
				probeCases: [[[0, '1', ['address', 'moduleName', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/move/module/[address]/[moduleName]/function/[functionName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]/(moveModule)/function/[functionName=stringSegment]',
		mappings: [
			{
				id: 'MoveFunction.ModuleFunctionName',
				probeAtomPrefixes: ['/network/[network]/move/module/[address]/[moduleName]/function/[functionName]:MoveFunction.ModuleFunctionName'],
				probeCases: [[[0, '1', ['functionName', 'address', 'moduleName', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/move/module/[address]/[moduleName]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]/(moveModule)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'MoveModule_Timestamp.ModuleTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/move/module/[address]/[moduleName]/observations/[timestampMs]/[source]:MoveModule_Timestamp.ModuleTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'moduleName', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/move/module/[address]/[moduleName]/struct/[structName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]/(moveModule)/struct/[structName=stringSegment]',
		mappings: [
			{
				id: 'MoveStruct.ModuleStructName',
				probeAtomPrefixes: ['/network/[network]/move/module/[address]/[moduleName]/struct/[structName]:MoveStruct.ModuleStructName'],
				probeCases: [[[0, '1', ['structName', 'address', 'moduleName', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/native-asset/[policyId]/[assetName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-asset/[policyId=stringSegment]/[assetName=stringSegment]',
		mappings: [
			{
				id: 'CardanoNativeAsset.NetworkPolicyIdAssetName',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/native-asset/[policyId]/[assetName]:CardanoNativeAsset.NetworkPolicyIdAssetName'],
				probeCases: [[[0, '1', ['policyId', 'assetName', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/native-asset/[policyId]/[assetName]/observations/[slot]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-asset/[policyId=stringSegment]/[assetName=stringSegment]/(cardanoNativeAsset)/observations/[slot=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoNativeAsset_Timestamp.AssetSlotSource',
				probeAtomPrefixes: ['/network/[network]/native-asset/[policyId]/[assetName]/observations/[slot]/[source]:CardanoNativeAsset_Timestamp.AssetSlotSource'],
				probeCases: [[[0, '1', ['slot', 'source', 'policyId', 'assetName', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/native-assets': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-assets',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nft-collection/[collectionAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-collection/[collectionAddress=stringSegment]',
		mappings: [
			{
				id: 'TonNftCollection.NetworkCollectionAddress',
				probeAtomPrefixes: ['/network/[network]/nft-collection/[collectionAddress]:TonNftCollection.NetworkCollectionAddress'],
				probeCases: [[[0, '1', ['collectionAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nft-collection/[collectionAddress]/item/[itemIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-collection/[collectionAddress=stringSegment]/(tonNftCollection)/item/[itemIndex=nonNegativeBigInt]',
		mappings: [
			{
				id: 'TonNftItem.CollectionItemIndex',
				probeAtomPrefixes: ['/network/[network]/nft-collection/[collectionAddress]/item/[itemIndex]:TonNftItem.CollectionItemIndex'],
				probeCases: [[[0, '1', ['itemIndex', 'collectionAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nft-collection/[collectionAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-collection/[collectionAddress=stringSegment]/(tonNftCollection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TonNftCollection_Timestamp.CollectionTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/nft-collection/[collectionAddress]/observations/[timestampMs]/[source]:TonNftCollection_Timestamp.CollectionTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'collectionAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nft-item/[itemAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-item/[itemAddress=stringSegment]',
		mappings: [
			{
				id: 'TonNftItem.NetworkItemAddress',
				probeAtomPrefixes: ['/network/[network]/nft-item/[itemAddress]:TonNftItem.NetworkItemAddress'],
				probeCases: [[[0, '1', ['itemAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nft-item/[itemAddress]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-item/[itemAddress=stringSegment]/(tonNftItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TonNftItem_Timestamp.ItemTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/nft-item/[itemAddress]/observations/[timestampMs]/[source]:TonNftItem_Timestamp.ItemTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'itemAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nft-transfer/[transferId]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-transfer/[transferId=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'TonNftTransfer.NetworkTransferIdSource',
				probeAtomPrefixes: ['/network/[network]/nft-transfer/[transferId]/[source]:TonNftTransfer.NetworkTransferIdSource'],
				probeCases: [[[0, '1', ['transferId', 'source', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nft-transfers': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-transfers',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/node/[nodeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/node/[nodeId=nonNegativeInteger]',
		mappings: [
			{
				id: 'HederaNode.NetworkNodeId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/node/[nodeId]:HederaNode.NetworkNodeId'],
				probeCases: [[[0, '1', ['nodeId', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/node/[nodeId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/node/[nodeId=nonNegativeInteger]/(hederaNode)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaNode_Timestamp.NodeTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/node/[nodeId]/observations/[timestampMs]/[source]:HederaNode_Timestamp.NodeTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'nodeId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nodes': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nodes/[pubkey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes/[pubkey=stringSegment]',
		mappings: [
			{
				id: 'LightningNode.NetworkPublicKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/nodes/[pubkey]:LightningNode.NetworkPublicKey'],
				probeCases: [[[0, '1', ['pubkey', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nodes/[pubkey]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes/[pubkey=stringSegment]/(lightningNode)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'LightningNode_Timestamp.NodeTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/nodes/[pubkey]/observations/[timestampMs]/[source]:LightningNode_Timestamp.NodeTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'pubkey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/observation/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Network_Timestamp.NetworkTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/observation/[timestampMs]/[source]:Network_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BittensorNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:BittensorNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'network']]]],
				projectionPath: [
					'Bittensor',
				],
			},
			{
				id: 'CardanoNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:CardanoNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'FilecoinNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:FilecoinNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
			{
				id: 'HederaNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:HederaNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'MoneroNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:MoneroNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'network']]]],
				projectionPath: [
					'Monero',
				],
			},
			{
				id: 'TonNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:TonNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'network']]]],
				projectionPath: [
					'Ton',
				],
			},
			{
				id: 'TronNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:TronNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
			{
				id: 'AvailNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:AvailNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Avail',
				],
			},
			{
				id: 'CelestiaNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:CelestiaNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Celestia',
				],
			},
			{
				id: 'DydxChainNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:DydxChainNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Dydx',
				],
			},
			{
				id: 'LightningNetwork_Timestamp.LightningNetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:LightningNetwork_Timestamp.LightningNetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
			{
				id: 'StarknetNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:StarknetNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
			{
				id: 'HyperliquidNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:HyperliquidNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
			{
				id: 'IcpNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:IcpNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'InternetComputer',
				],
			},
			{
				id: 'KaspaNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:KaspaNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Kaspa',
				],
			},
			{
				id: 'LogosBlockchainNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:LogosBlockchainNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Logos',
				],
			},
			{
				id: 'StellarNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:StellarNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Stellar',
				],
			},
			{
				id: 'SuiNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:SuiNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
			{
				id: 'TezosNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:TezosNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Tezos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/oracle/feed/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/oracle/feed/[address=evmAddress]',
		mappings: [
			{
				id: 'OracleFeed.EvmNetworkAddress',
				probeAtomPrefixes: ['/network/[network]/oracle/feed/[address]:OracleFeed.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/oracle/feed/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/oracle/feed/[address=evmAddress]/(oracleFeed)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'OracleFeed_Timestamp.OracleFeedTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/oracle/feed/[address]/observations/[timestampMs]/[source]:OracleFeed_Timestamp.OracleFeedTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/oracle/feed/[address]/round/[roundId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/oracle/feed/[address=evmAddress]/(oracleFeed)/round/[roundId=nonNegativeBigInt]',
		mappings: [
			{
				id: 'OracleFeed_Round.OracleFeedRoundId',
				probeAtomPrefixes: ['/network/[network]/oracle/feed/[address]/round/[roundId]:OracleFeed_Round.OracleFeedRoundId'],
				probeCases: [[[0, '1', ['roundId', 'address', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/osmosis-pool/[poolId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-pool/[poolId=stringSegment]',
		mappings: [
			{
				id: 'OsmosisPool.NetworkPoolId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/osmosis-pool/[poolId]:OsmosisPool.NetworkPoolId'],
				probeCases: [[[0, '1', ['poolId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/osmosis-pool/[poolId]/asset/[denom]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-pool/[poolId=stringSegment]/(osmosisPool)/asset/[denom=stringSegment]',
		mappings: [
			{
				id: 'OsmosisPoolAsset.PoolDenom',
				probeAtomPrefixes: ['/network/[network]/osmosis-pool/[poolId]/asset/[denom]:OsmosisPoolAsset.PoolDenom'],
				probeCases: [[[0, '1', ['denom', 'poolId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/osmosis-pool/[poolId]/observations/[blockHeight]/[baseAssetDenom]/[quoteAssetDenom]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-pool/[poolId=stringSegment]/(osmosisPool)/observations/[blockHeight=nonNegativeBigInt]/[baseAssetDenom=stringSegment]/[quoteAssetDenom=stringSegment]',
		mappings: [
			{
				id: 'OsmosisPool_Timestamp.PoolBlockBaseQuote',
				probeAtomPrefixes: ['/network/[network]/osmosis-pool/[poolId]/observations/[blockHeight]/[baseAssetDenom]/[quoteAssetDenom]:OsmosisPool_Timestamp.PoolBlockBaseQuote'],
				probeCases: [[[0, '1', ['blockHeight', 'baseAssetDenom', 'quoteAssetDenom', 'poolId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/osmosis-position/[positionId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-position/[positionId=stringSegment]',
		mappings: [
			{
				id: 'OsmosisPosition.NetworkPositionId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/osmosis-position/[positionId]:OsmosisPosition.NetworkPositionId'],
				probeCases: [[[0, '1', ['positionId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/pallet/[palletName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pallet/[palletName=stringSegment]',
		mappings: [
			{
				id: 'PolkadotPallet.NetworkPalletName',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/pallet/[palletName]:PolkadotPallet.NetworkPalletName'],
				probeCases: [[[0, '1', ['palletName', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/payments': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/payments/[paymentHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningPayment.NetworkPaymentHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/payments/[paymentHash]:BlockheadLightningPayment.NetworkPaymentHash'],
				probeCases: [[[0, '1', ['paymentHash', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/payments/[paymentHash]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]/(blockheadLightningPayment)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningPayment_Timestamp.PaymentTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/payments/[paymentHash]/observations/[timestampMs]/[source]:BlockheadLightningPayment_Timestamp.PaymentTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'paymentHash', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/pendle/market/[marketAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pendle/market/[marketAddress=evmAddress]',
		mappings: [
			{
				id: 'PendleMarket.NetworkMarketAddress',
				probeAtomPrefixes: ['/network/[network]/pendle/market/[marketAddress]:PendleMarket.NetworkMarketAddress'],
				probeCases: [[[0, '1', ['marketAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/pendle/market/[marketAddress]/position/[accountAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pendle/market/[marketAddress=evmAddress]/(pendleMarket)/position/[accountAddress=evmAddress]',
		mappings: [
			{
				id: 'PendlePosition.AccountMarket',
				probeAtomPrefixes: ['/network/[network]/pendle/market/[marketAddress]/position/[accountAddress]:PendlePosition.AccountMarket'],
				probeCases: [[[0, '1', ['accountAddress', 'marketAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/perp-market/[coin]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/perp-market/[coin=stringSegment]',
		mappings: [
			{
				id: 'HyperliquidPerpMarket.NetworkCoin',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/perp-market/[coin]:HyperliquidPerpMarket.NetworkCoin'],
				probeCases: [[[0, '1', ['coin', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/precompiles': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/precompiles',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/program/[programId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/program/[programId=stringSegment]',
		mappings: [
			{
				id: 'SolanaProgram.NetworkProgramId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/program/[programId]:SolanaProgram.NetworkProgramId'],
				probeCases: [[[0, '1', ['programId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/programs': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/programs',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/protocol-parameters/[epoch]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/protocol-parameters/[epoch=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoProtocolParameters_Epoch.NetworkEpochSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/protocol-parameters/[epoch]/[source]:CardanoProtocolParameters_Epoch.NetworkEpochSource'],
				probeCases: [[[0, '1', ['source', 'epoch', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/receipt/[receiptId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/receipt/[receiptId=stringSegment]',
		mappings: [
			{
				id: 'NearReceipt.NetworkReceiptId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/receipt/[receiptId]:NearReceipt.NetworkReceiptId'],
				probeCases: [[[0, '1', ['receiptId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/rollup/[projectId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]',
		mappings: [
			{
				id: 'EvmRollup.EvmNetworkProjectId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/rollup/[projectId]:EvmRollup.EvmNetworkProjectId'],
				probeCases: [[[0, '1', ['projectId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]/(evmRollup)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmRollup_Timestamp.RollupTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]:EvmRollup_Timestamp.RollupTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'projectId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/rpc-urls': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rpc-urls',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/rune/[runeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rune/[runeId=stringSegment]',
		mappings: [
			{
				id: 'BitcoinRune.NetworkRuneId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/rune/[runeId]:BitcoinRune.NetworkRuneId'],
				probeCases: [[[0, '1', ['runeId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/scaling/[claimSource]/[sourceProjectId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/scaling/[claimSource=stringSegment]/[sourceProjectId=stringSegment]',
		mappings: [
			{
				id: 'ScalingDeploymentClaim.NetworkSourceSourceProjectId',
				probeAtomPrefixes: ['/network/[network]/scaling/[claimSource]/[sourceProjectId]:ScalingDeploymentClaim.NetworkSourceSourceProjectId'],
				probeCases: [[[0, '1', ['claimSource', 'sourceProjectId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/scaling/[claimSource]/[sourceProjectId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/scaling/[claimSource=stringSegment]/[sourceProjectId=stringSegment]/(scalingDeploymentClaim)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'ScalingDeploymentClaim_Timestamp.ClaimTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/scaling/[claimSource]/[sourceProjectId]/observations/[timestampMs]/[source]:ScalingDeploymentClaim_Timestamp.ClaimTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'claimSource', 'sourceProjectId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/schedule/[scheduleId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/schedule/[scheduleId=stringSegment]',
		mappings: [
			{
				id: 'HederaSchedule.NetworkScheduleId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/schedule/[scheduleId]:HederaSchedule.NetworkScheduleId'],
				probeCases: [[[0, '1', ['scheduleId', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/schedule/[scheduleId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/schedule/[scheduleId=stringSegment]/(hederaSchedule)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaSchedule_Timestamp.ScheduleTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/schedule/[scheduleId]/observations/[timestampMs]/[source]:HederaSchedule_Timestamp.ScheduleTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'scheduleId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/schedule/[scheduleId]/signature/[publicKeyPrefix]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/schedule/[scheduleId=stringSegment]/(hederaSchedule)/signature/[publicKeyPrefix=stringSegment]',
		mappings: [
			{
				id: 'HederaScheduleSignature.SchedulePublicKeyPrefix',
				probeAtomPrefixes: ['/network/[network]/schedule/[scheduleId]/signature/[publicKeyPrefix]:HederaScheduleSignature.SchedulePublicKeyPrefix'],
				probeCases: [[[0, '1', ['publicKeyPrefix', 'scheduleId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/shielded-pool/[pool]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/shielded-pool/[pool=stringSegment]',
		mappings: [
			{
				id: 'ZcashShieldedPool.NetworkPool',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/shielded-pool/[pool]:ZcashShieldedPool.NetworkPool'],
				probeCases: [[[0, '1', ['pool', 'network']]], [[0, '2', ['pool', 'network']]]],
				projectionPath: [
					'Zcash',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slashings': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slashings',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconSlot.EvmNetworkSlot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/slot/[slot]:BeaconSlot.EvmNetworkSlot'],
				probeCases: [[[0, '1', ['slot', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/committee/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/committee/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconCommittee.EvmNetworkSlotIndexInSlot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/slot/[slot]/committee/[index]:BeaconCommittee.EvmNetworkSlotIndexInSlot'],
				probeCases: [[[0, '1', ['slot', 'index', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slots': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slots',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/stake-credential/[credential]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-credential/[credential=stringSegment]',
		mappings: [
			{
				id: 'CardanoStakeCredential.NetworkCredential',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/stake-credential/[credential]:CardanoStakeCredential.NetworkCredential'],
				probeCases: [[[0, '1', ['credential', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/stake-credential/[credential]/delegation/[epoch]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-credential/[credential=stringSegment]/(cardanoStakeCredential)/delegation/[epoch=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoStakeDelegation_Epoch.StakeCredentialEpochSource',
				probeAtomPrefixes: ['/network/[network]/stake-credential/[credential]/delegation/[epoch]/[source]:CardanoStakeDelegation_Epoch.StakeCredentialEpochSource'],
				probeCases: [[[0, '1', ['epoch', 'source', 'credential', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/stake-pool/[poolId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-pool/[poolId=stringSegment]',
		mappings: [
			{
				id: 'CardanoStakePool.NetworkPoolId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/stake-pool/[poolId]:CardanoStakePool.NetworkPoolId'],
				probeCases: [[[0, '1', ['poolId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/stake-pool/[poolId]/observations/[epoch]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-pool/[poolId=stringSegment]/(cardanoStakePool)/observations/[epoch=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoStakePool_Timestamp.PoolEpochSource',
				probeAtomPrefixes: ['/network/[network]/stake-pool/[poolId]/observations/[epoch]/[source]:CardanoStakePool_Timestamp.PoolEpochSource'],
				probeCases: [[[0, '1', ['source', 'epoch', 'poolId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/subnet/[netuid]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/subnet/[netuid=nonNegativeInteger]',
		mappings: [
			{
				id: 'BittensorSubnet.NetworkNetuid',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/subnet/[netuid]:BittensorSubnet.NetworkNetuid'],
				probeCases: [[[0, '1', ['netuid', 'network']]]],
				projectionPath: [
					'Bittensor',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/subnet/[netuid]/neuron/[uid]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/subnet/[netuid=nonNegativeInteger]/(bittensorSubnet)/neuron/[uid=nonNegativeInteger]',
		mappings: [
			{
				id: 'BittensorNeuron.BittensorSubnetUid',
				probeAtomPrefixes: ['/network/[network]/subnet/[netuid]/neuron/[uid]:BittensorNeuron.BittensorSubnetUid'],
				probeCases: [[[0, '1', ['uid', 'netuid', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sui-checkpoint-digest/[digest]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-checkpoint-digest/[digest=stringSegment]',
		mappings: [
			{
				id: 'SuiCheckpoint.NetworkDigest',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/sui-checkpoint-digest/[digest]:SuiCheckpoint.NetworkDigest'],
				probeCases: [[[0, '1', ['digest', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sui-checkpoint/[sequence]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-checkpoint/[sequence=nonNegativeBigInt]',
		mappings: [
			{
				id: 'SuiCheckpoint.NetworkSequence',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/sui-checkpoint/[sequence]:SuiCheckpoint.NetworkSequence'],
				probeCases: [[[0, '1', ['sequence', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sui-tx/[digest]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]',
		mappings: [
			{
				id: 'SuiTransaction.NetworkDigest',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/sui-tx/[digest]:SuiTransaction.NetworkDigest'],
				probeCases: [[[0, '1', ['digest', 'network']]]],
				projectionPath: [
					'Sui',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sui-tx/[digest]/balance-change/[changeIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]/(suiTransaction)/balance-change/[changeIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'SuiBalanceChange.TransactionChangeIndex',
				probeAtomPrefixes: ['/network/[network]/sui-tx/[digest]/balance-change/[changeIndex]:SuiBalanceChange.TransactionChangeIndex'],
				probeCases: [[[0, '1', ['changeIndex', 'digest', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sui-tx/[digest]/command/[commandIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]/(suiTransaction)/command/[commandIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'SuiProgrammableTransactionCommand.TransactionCommandIndex',
				probeAtomPrefixes: ['/network/[network]/sui-tx/[digest]/command/[commandIndex]:SuiProgrammableTransactionCommand.TransactionCommandIndex'],
				probeCases: [[[0, '1', ['commandIndex', 'digest', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sui-tx/[digest]/object-change/[changeIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]/(suiTransaction)/object-change/[changeIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'SuiObjectChange.TransactionChangeIndex',
				probeAtomPrefixes: ['/network/[network]/sui-tx/[digest]/object-change/[changeIndex]:SuiObjectChange.TransactionChangeIndex'],
				probeCases: [[[0, '1', ['changeIndex', 'digest', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sui-tx/[digest]/observations/[checkpointSequence]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]/(suiTransaction)/observations/[checkpointSequence=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'SuiTransaction_Timestamp.TransactionCheckpointSequenceSource',
				probeAtomPrefixes: ['/network/[network]/sui-tx/[digest]/observations/[checkpointSequence]/[source]:SuiTransaction_Timestamp.TransactionCheckpointSequenceSource'],
				probeCases: [[[0, '1', ['source', 'checkpointSequence', 'digest', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sync-committee/[period]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committee/[period=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconSyncCommittee.EvmNetworkPeriod',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/sync-committee/[period]:BeaconSyncCommittee.EvmNetworkPeriod'],
				probeCases: [[[0, '1', ['period', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sync-committees': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committees',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/tipset/[height]/[tipsetKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/tipset/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]',
		mappings: [
			{
				id: 'FilecoinTipset.NetworkHeightTipsetKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tipset/[height]/[tipsetKey]:FilecoinTipset.NetworkHeightTipsetKey'],
				probeCases: [[[0, '1', ['height', 'tipsetKey', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-account/[tokenAccountPubkey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-account/[tokenAccountPubkey=stringSegment]',
		mappings: [
			{
				id: 'SolanaTokenAccount.NetworkTokenAccountPubkey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token-account/[tokenAccountPubkey]:SolanaTokenAccount.NetworkTokenAccountPubkey'],
				probeCases: [[[0, '1', ['tokenAccountPubkey', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-account/[tokenAccountPubkey]/observations/[slot]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-account/[tokenAccountPubkey=stringSegment]/(solanaTokenAccount)/observations/[slot=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'SolanaTokenAccount_Timestamp.TokenAccountSlotSource',
				probeAtomPrefixes: ['/network/[network]/token-account/[tokenAccountPubkey]/observations/[slot]/[source]:SolanaTokenAccount_Timestamp.TokenAccountSlotSource'],
				probeCases: [[[0, '1', ['source', 'slot', 'tokenAccountPubkey', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-accounts': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-accounts',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-mint/[mintAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mint/[mintAddress=stringSegment]',
		mappings: [
			{
				id: 'SolanaTokenMint.NetworkMintAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token-mint/[mintAddress]:SolanaTokenMint.NetworkMintAddress'],
				probeCases: [[[0, '1', ['mintAddress', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-mint/[mintAddress]/observations/[slot]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mint/[mintAddress=stringSegment]/(solanaTokenMint)/observations/[slot=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'SolanaTokenMint_Timestamp.MintSlotSource',
				probeAtomPrefixes: ['/network/[network]/token-mint/[mintAddress]/observations/[slot]/[source]:SolanaTokenMint_Timestamp.MintSlotSource'],
				probeCases: [[[0, '1', ['source', 'slot', 'mintAddress', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-mints': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mints',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token/[tokenId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]',
		mappings: [
			{
				id: 'HederaToken.NetworkTokenId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token/[tokenId]:HederaToken.NetworkTokenId'],
				probeCases: [[[0, '1', ['tokenId', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'TronToken.NetworkTokenId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token/[tokenId]:TronToken.NetworkTokenId'],
				probeCases: [[[0, '1', ['tokenId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token/[tokenId]/nft/[serialNumber]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/nft/[serialNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'HederaNft.TokenSerialNumber',
				probeAtomPrefixes: ['/network/[network]/token/[tokenId]/nft/[serialNumber]:HederaNft.TokenSerialNumber'],
				probeCases: [[[0, '1', ['serialNumber', 'tokenId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token/[tokenId]/nft/[serialNumber]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/nft/[serialNumber=nonNegativeBigInt]/(hederaNft)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaNft_Timestamp.NftTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/token/[tokenId]/nft/[serialNumber]/observations/[timestampMs]/[source]:HederaNft_Timestamp.NftTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'serialNumber', 'tokenId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token/[tokenId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaToken_Timestamp.TokenTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token/[tokenId]/observations/[timestampMs]/[source]:HederaToken_Timestamp.TokenTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'tokenId', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'TronToken_Timestamp.TokenTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token/[tokenId]/observations/[timestampMs]/[source]:TronToken_Timestamp.TokenTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'tokenId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token/[tokenId]/observations/[timestampMs]/[source]/fee/[feeIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/(selection)/fee/[feeIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'HederaTokenCustomFee.TokenTimestampFeeIndex',
				probeAtomPrefixes: ['/network/[network]/token/[tokenId]/observations/[timestampMs]/[source]/fee/[feeIndex]:HederaTokenCustomFee.TokenTimestampFeeIndex'],
				probeCases: [[[0, '1', ['feeIndex', 'timestampMs', 'source', 'tokenId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/topic/[topicId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/topic/[topicId=stringSegment]',
		mappings: [
			{
				id: 'HederaTopic.NetworkTopicId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/topic/[topicId]:HederaTopic.NetworkTopicId'],
				probeCases: [[[0, '1', ['topicId', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/topic/[topicId]/message/[sequenceNumber]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/topic/[topicId=stringSegment]/(hederaTopic)/message/[sequenceNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'HederaTopicMessage.TopicSequenceNumber',
				probeAtomPrefixes: ['/network/[network]/topic/[topicId]/message/[sequenceNumber]:HederaTopicMessage.TopicSequenceNumber'],
				probeCases: [[[0, '1', ['sequenceNumber', 'topicId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/topic/[topicId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/topic/[topicId=stringSegment]/(hederaTopic)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'HederaTopic_Timestamp.TopicTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/topic/[topicId]/observations/[timestampMs]/[source]:HederaTopic_Timestamp.TopicTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'topicId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/trace/[traceId]/[traceSource]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trace/[traceId=stringSegment]/[traceSource=stringSegment]',
		mappings: [
			{
				id: 'TonTrace.NetworkTraceIdSource',
				probeAtomPrefixes: ['/network/[network]/trace/[traceId]/[traceSource]:TonTrace.NetworkTraceIdSource'],
				probeCases: [[[0, '1', ['traceId', 'traceSource', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/trace/[traceId]/[traceSource]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trace/[traceId=stringSegment]/[traceSource=stringSegment]/(tonTrace)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TonTrace_Timestamp.TraceTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/trace/[traceId]/[traceSource]/observations/[timestampMs]/[source]:TonTrace_Timestamp.TraceTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'traceId', 'traceSource', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/transaction/[transactionId]/transfer/[transferIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transaction/[transactionId=stringSegment]/transfer/[transferIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'TronTokenTransfer.NetworkTransactionIdTransferIndex',
				probeAtomPrefixes: ['/network/[network]/transaction/[transactionId]/transfer/[transferIndex]:TronTokenTransfer.NetworkTransactionIdTransferIndex'],
				probeCases: [[[0, '1', ['transactionId', 'transferIndex', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/transaction/xrpl/[hash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transaction/xrpl/[hash=stringSegment]',
		mappings: [
			{
				id: 'XrplTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/xrpl/[hash]:XrplTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['hash', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/transaction/xrpl/[hash]/observations/[ledgerIndex]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transaction/xrpl/[hash=stringSegment]/(xrplTransaction)/observations/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'XrplTransaction_Timestamp.TransactionLedgerIndexSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/xrpl/[hash]/observations/[ledgerIndex]/[source]:XrplTransaction_Timestamp.TransactionLedgerIndexSource'],
				probeCases: [[[0, '1', ['source', 'ledgerIndex', 'hash', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/transactions': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transactions',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/trustline/[account]/[currency]/[issuer]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]',
		mappings: [
			{
				id: 'XrplTrustline.NetworkAccountCurrencyIssuer',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/trustline/[account]/[currency]/[issuer]:XrplTrustline.NetworkAccountCurrencyIssuer'],
				probeCases: [[[0, '1', ['account', 'currency', 'issuer', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/trustline/[account]/[currency]/[issuer]/observations/[ledgerIndex]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]/(xrplTrustline)/observations/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'XrplTrustline_Timestamp.TrustlineLedgerIndexSource',
				probeAtomPrefixes: ['/network/[network]/trustline/[account]/[currency]/[issuer]/observations/[ledgerIndex]/[source]:XrplTrustline_Timestamp.TrustlineLedgerIndexSource'],
				probeCases: [[[0, '1', ['source', 'ledgerIndex', 'account', 'currency', 'issuer', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/upgrade/id/[upgradeId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/upgrade/id/[upgradeId=stringSegment]',
		mappings: [
			{
				id: 'NetworkUpgrade.NetworkUpgradeId',
				probeAtomPrefixes: ['/network/[network]/upgrade/id/[upgradeId]:NetworkUpgrade.NetworkUpgradeId'],
				probeCases: [[[0, '1', ['upgradeId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/upgrade/id/[upgradeId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/upgrade/id/[upgradeId=stringSegment]/(networkUpgrade)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'NetworkUpgrade_Timestamp.UpgradeTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/upgrade/id/[upgradeId]/observations/[timestampMs]/[source]:NetworkUpgrade_Timestamp.UpgradeTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'upgradeId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/upgrades': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/upgrades',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/user-operation/[userOperationHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/user-operation/[userOperationHash=userOperationHash]',
		mappings: [
			{
				id: 'EvmUserOperation.EvmNetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/user-operation/[userOperationHash]:EvmUserOperation.EvmNetworkHash'],
				probeCases: [[[0, '1', ['userOperationHash', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validator/[validatorId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]',
		mappings: [
			{
				id: 'BeaconValidator.NetworkIndexInNetwork',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/[validatorId]:BeaconValidator.NetworkIndexInNetwork'],
				probeCases: [[[0, '1', ['validatorId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaValidator.NetworkVotePubkey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/[validatorId]:SolanaValidator.NetworkVotePubkey'],
				probeCases: [[[0, '1', ['validatorId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CosmosValidator.NetworkOperatorAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/[validatorId]:CosmosValidator.NetworkOperatorAddress'],
				probeCases: [[[0, '1', ['validatorId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'NearValidator.NetworkAccountId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/[validatorId]:NearValidator.NetworkAccountId'],
				probeCases: [[[0, '1', ['validatorId', 'network']]]],
				projectionPath: [
					'Near',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validator/[validatorId]/epoch/[epochId]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]/(selection)/epoch/[epochId=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'NearValidator_Timestamp.ValidatorEpochIdSource',
				probeAtomPrefixes: ['/network/[network]/validator/[validatorId]/epoch/[epochId]/[source]:NearValidator_Timestamp.ValidatorEpochIdSource'],
				probeCases: [[[0, '1', ['epochId', 'source', 'validatorId', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validator/[validatorId]/observations/[slot]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]/(selection)/observations/[slot=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BeaconValidator_Timestamp.ValidatorSlotSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/[validatorId]/observations/[slot]/[source]:BeaconValidator_Timestamp.ValidatorSlotSource'],
				probeCases: [[[0, '1', ['slot', 'source', 'validatorId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validator/[validatorId]/timestamp/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]/(selection)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'CosmosValidator_Timestamp.ValidatorTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/[validatorId]/timestamp/[timestampMs]/[source]:CosmosValidator_Timestamp.ValidatorTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'validatorId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validator/pubkey/[validatorPubkey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/pubkey/[validatorPubkey=stringSegment]',
		mappings: [
			{
				id: 'BeaconValidator.NetworkPubkey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/pubkey/[validatorPubkey]:BeaconValidator.NetworkPubkey'],
				probeCases: [[[0, '1', ['validatorPubkey', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validators': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validators',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/withdrawals': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/withdrawals',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/witness/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/witness/[address=stringSegment]',
		mappings: [
			{
				id: 'TronWitness.NetworkAddress',
				probeAtomPrefixes: ['/network/[network]/witness/[address]:TronWitness.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/workchain/[workchain]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/workchain/[workchain=nonNegativeInteger]',
		mappings: [
			{
				id: 'TonWorkchain.NetworkWorkchain',
				probeAtomPrefixes: ['/network/[network]/workchain/[workchain]:TonWorkchain.NetworkWorkchain'],
				probeCases: [[[0, '1', ['workchain', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/workchain/[workchain]/shard/[shardPrefix]/[seqno]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/workchain/[workchain=nonNegativeInteger]/(tonWorkchain)/shard/[shardPrefix=stringSegment]/[seqno=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'TonShard_Timestamp.WorkchainShardPrefixSeqnoSource',
				probeAtomPrefixes: ['/network/[network]/workchain/[workchain]/shard/[shardPrefix]/[seqno]/[source]:TonShard_Timestamp.WorkchainShardPrefixSeqnoSource'],
				probeCases: [[[0, '1', ['shardPrefix', 'seqno', 'source', 'workchain', 'network']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(calldata)/calldata/[hex]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(calldata)/calldata/[hex=zeroExHex]',
		mappings: [
			{
				id: 'EvmCalldata.Hex',
				probeAtomPrefixes: ['/evm/calldata/[hex]:EvmCalldata.Hex'],
				probeCases: [[[0, '1', ['hex']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(errors)/error/[hex]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]',
		mappings: [
			{
				id: 'EvmError.Hex',
				probeAtomPrefixes: ['/evm/error/[hex]:EvmError.Hex'],
				probeCases: [[[0, '1', ['hex']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(selectors)/selector/[hex]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]',
		mappings: [
			{
				id: 'EvmSelector.Hex',
				probeAtomPrefixes: ['/evm/selector/[hex]:EvmSelector.Hex'],
				probeCases: [[[0, '1', ['hex']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(topics)/topic/[hex]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]',
		mappings: [
			{
				id: 'EvmTopic.Hex',
				probeAtomPrefixes: ['/evm/topic/[hex]:EvmTopic.Hex'],
				probeCases: [[[0, '1', ['hex']]]],
			},
		],
	},
	'/(explore)/account/[address]': {
		routeId: '/(explore)/account/[address=evmAddress]',
		mappings: [
			{
				id: 'EvmAccount.Address',
				probeAtomPrefixes: ['/account/[address]:EvmAccount.Address'],
				probeCases: [[[0, '1', ['address']]]],
			},
		],
	},
	'/(explore)/account/[namespace]:[reference]/[accountAddress]': {
		routeId: '/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
		mappings: [
			{
				id: 'Account.Caip10',
				probeAtomPrefixes: ['/account/[namespace]:[reference]/[accountAddress]:Account.Caip10'],
				probeCases: [[[0, '1', ['namespace', 'reference', 'accountAddress']]]],
			},
		],
	},
	'/(explore)/account/[namespace]:[reference]/[accountAddress]/ens/reverse/[ensName]': {
		routeId: '/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]/(account)/ens/reverse/[ensName=stringSegment]',
		parameterEncodingByName: {
			ensName: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsReverseRecord.AccountName',
				probeAtomPrefixes: ['/account/[namespace]:[reference]/[accountAddress]/ens/reverse/[ensName]:EnsReverseRecord.AccountName'],
				probeCases: [[[0, '1', ['ensName', 'namespace', 'reference', 'accountAddress']]]],
			},
		],
	},
	'/(explore)/media/[url]': {
		routeId: '/(explore)/media/[url=absoluteUrl]',
		parameterEncodingByName: {
			url: 'Opaque',
		},
		mappings: [
			{
				id: 'Media.Url',
				probeAtomPrefixes: ['/media/[url]:Media.Url'],
				probeCases: [[[0, '1', ['url']]]],
			},
		],
	},
	'/(explore)/network-stack/[networkStackId]': {
		routeId: '/(explore)/network-stack/[networkStackId=stringSegment]',
		mappings: [
			{
				id: 'NetworkStack.NetworkStackId',
				probeAtomPrefixes: ['/network-stack/[networkStackId]:NetworkStack.NetworkStackId'],
				probeCases: [[[0, '1', ['networkStackId']]]],
			},
		],
	},
	'/(explore)/url/[url]': {
		routeId: '/(explore)/url/[url=absoluteUrl]',
		parameterEncodingByName: {
			url: 'Opaque',
		},
		mappings: [
			{
				id: 'Url.Url',
				probeAtomPrefixes: ['/url/[url]:Url.Url'],
				probeCases: [[[0, '1', ['url']]]],
			},
		],
	},
	'/(explore)/url/[url]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/url/[url=absoluteUrl]/(url)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			url: 'Opaque',
		},
		mappings: [
			{
				id: 'UrlPreview_Timestamp.UrlTimestampMsSource',
				probeAtomPrefixes: ['/url/[url]/observations/[timestampMs]/[source]:UrlPreview_Timestamp.UrlTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'url']]]],
			},
		],
	},
	'/(proposals)/proposals/[specificationRealmSlug]': {
		routeId: '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
		mappings: [
			{
				id: 'SpecificationRealm.Realm',
				probeAtomPrefixes: ['/proposals/[specificationRealmSlug]:SpecificationRealm.Realm'],
				probeCases: [[[0, '1', ['specificationRealmSlug']]]],
			},
		],
	},
	'/(proposals)/proposals/[specificationRealmSlug]/[proposalKindSlug]': {
		routeId: '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]',
		mappings: [
			{
				id: 'SpecificationProposalKind.RealmCategory',
				probeAtomPrefixes: ['/proposals/[specificationRealmSlug]/[proposalKindSlug]:SpecificationProposalKind.RealmCategory'],
				probeCases: [[[0, '1', ['specificationRealmSlug', 'proposalKindSlug']]]],
			},
		],
	},
	'/(proposals)/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]': {
		routeId: '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]',
		mappings: [
			{
				id: 'SpecificationProposal.RealmCategoryNumber',
				probeAtomPrefixes: ['/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]:SpecificationProposal.RealmCategoryNumber'],
				probeCases: [[[0, '1', ['specificationRealmSlug', 'proposalKindSlug', 'proposalRef']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/actor/[activityStreamsUri]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[activityStreamsUri=stringSegment]',
		mappings: [
			{
				id: 'ActivityPubActor.ActivityStreamsUri',
				probeAtomPrefixes: ['/activitypub/actor/[activityStreamsUri]:ActivityPubActor.ActivityStreamsUri'],
				probeCases: [[[0, '1', ['activityStreamsUri']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubActor.LocalAccountId',
				probeAtomPrefixes: ['/activitypub/actor/[instanceOrigin]/[localAccountId]:ActivityPubActor.LocalAccountId'],
				probeCases: [[[0, '1', ['instanceOrigin', 'localAccountId']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/notes': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/notes',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubActor.LocalAccountId',
				probeAtomPrefixes: ['/activitypub/actor/[instanceOrigin]/[localAccountId]:ActivityPubActor.LocalAccountId'],
				probeCases: [[[0, '1', ['instanceOrigin', 'localAccountId']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/@[acct]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/@[acct=stringSegment]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubActor.Acct',
				probeAtomPrefixes: ['/activitypub/actor/[instanceOrigin]/@[acct]:ActivityPubActor.Acct'],
				probeCases: [[[0, '1', ['instanceOrigin', 'acct']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/instance/[instanceOrigin]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubInstance.InstanceOrigin',
				probeAtomPrefixes: ['/activitypub/instance/[instanceOrigin]:ActivityPubInstance.InstanceOrigin'],
				probeCases: [[[0, '1', ['instanceOrigin']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]/moderated-domain/[digest]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/moderated-domain/[digest=stringSegment]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubInstanceModeratedDomain.ObservationDigest',
				probeAtomPrefixes: ['/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]/moderated-domain/[digest]:ActivityPubInstanceModeratedDomain.ObservationDigest'],
				probeCases: [[[0, '1', ['digest', 'timestampMs', 'source', 'instanceOrigin']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]/peer/[peerDomain]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/peer/[peerDomain=stringSegment]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubInstancePeer.ObservationPeerDomain',
				probeAtomPrefixes: ['/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]/peer/[peerDomain]:ActivityPubInstancePeer.ObservationPeerDomain'],
				probeCases: [[[0, '1', ['peerDomain', 'timestampMs', 'source', 'instanceOrigin']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/note/[activityStreamsUri]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[activityStreamsUri=stringSegment]',
		mappings: [
			{
				id: 'ActivityPubNote.ActivityStreamsUri',
				probeAtomPrefixes: ['/activitypub/note/[activityStreamsUri]:ActivityPubNote.ActivityStreamsUri'],
				probeCases: [[[0, '1', ['activityStreamsUri']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubNote.InstanceOriginLocalStatusId',
				probeAtomPrefixes: ['/activitypub/note/[instanceOrigin]/[localStatusId]:ActivityPubNote.InstanceOriginLocalStatusId'],
				probeCases: [[[0, '1', ['instanceOrigin', 'localStatusId']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/thread': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/thread',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubNote.InstanceOriginLocalStatusId',
				probeAtomPrefixes: ['/activitypub/note/[instanceOrigin]/[localStatusId]:ActivityPubNote.InstanceOriginLocalStatusId'],
				probeCases: [[[0, '1', ['instanceOrigin', 'localStatusId']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/actor/[did]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]',
		parameterEncodingByName: {
			did: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoActor.Did',
				probeAtomPrefixes: ['/atproto/actor/[did]:AtprotoActor.Did'],
				probeCases: [[[0, '1', ['did']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/actor/[did]/observations': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations',
		parameterEncodingByName: {
			did: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoActor.Did',
				probeAtomPrefixes: ['/atproto/actor/[did]:AtprotoActor.Did'],
				probeCases: [[[0, '1', ['did']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/actor/[did]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			did: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoActor_Timestamp.AtprotoActorTimestampMsSource',
				probeAtomPrefixes: ['/atproto/actor/[did]/observations/[timestampMs]/[source]:AtprotoActor_Timestamp.AtprotoActorTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'did']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/actor/[did]/posts': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/posts',
		parameterEncodingByName: {
			did: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoActor.Did',
				probeAtomPrefixes: ['/atproto/actor/[did]:AtprotoActor.Did'],
				probeCases: [[[0, '1', ['did']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/actor/handle/[handle]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/handle/[handle=stringSegment]',
		mappings: [
			{
				id: 'AtprotoActor.Handle',
				probeAtomPrefixes: ['/atproto/actor/handle/[handle]:AtprotoActor.Handle'],
				probeCases: [[[0, '1', ['handle']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/feed/[...uri]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/feed/[...uri=stringSegment]',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoFeedGenerator.Uri',
				probeAtomPrefixes: ['/atproto/feed/[...uri]:AtprotoFeedGenerator.Uri'],
				probeCases: [[[0, '1', ['uri']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/graph-list/[...uri]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/graph-list/[...uri=stringSegment]',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoGraphList.Uri',
				probeAtomPrefixes: ['/atproto/graph-list/[...uri]:AtprotoGraphList.Uri'],
				probeCases: [[[0, '1', ['uri']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/post/[...uri]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoPost.Uri',
				probeAtomPrefixes: ['/atproto/post/[...uri]:AtprotoPost.Uri'],
				probeCases: [[[0, '1', ['uri']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/post/[...uri]/observations': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoPost.Uri',
				probeAtomPrefixes: ['/atproto/post/[...uri]:AtprotoPost.Uri'],
				probeCases: [[[0, '1', ['uri']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/post/[...uri]/thread': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/thread',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoPost.Uri',
				probeAtomPrefixes: ['/atproto/post/[...uri]:AtprotoPost.Uri'],
				probeCases: [[[0, '1', ['uri']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/repo/[repoDid]/commit/cid/[commitCid]/[source]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/repo/[repoDid=stringSegment]/commit/cid/[commitCid=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'AtprotoRepoCommit.RepoDidCommitCidSource',
				probeAtomPrefixes: ['/atproto/repo/[repoDid]/commit/cid/[commitCid]/[source]:AtprotoRepoCommit.RepoDidCommitCidSource'],
				probeCases: [[[0, '1', ['repoDid', 'commitCid', 'source']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/repo/[repoDid]/commit/rev/[rev]/[source]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/repo/[repoDid=stringSegment]/commit/rev/[rev=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'AtprotoRepoCommit.RepoDidRevSource',
				probeAtomPrefixes: ['/atproto/repo/[repoDid]/commit/rev/[rev]/[source]:AtprotoRepoCommit.RepoDidRevSource'],
				probeCases: [[[0, '1', ['repoDid', 'rev', 'source']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/starter-pack/[...uri]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/starter-pack/[...uri=stringSegment]',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoStarterPack.Uri',
				probeAtomPrefixes: ['/atproto/starter-pack/[...uri]:AtprotoStarterPack.Uri'],
				probeCases: [[[0, '1', ['uri']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/account/[connectionId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/account/[connectionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadFarcasterAccountConnection.ConnectionId',
				probeAtomPrefixes: ['/farcaster/account/[connectionId]:BlockheadFarcasterAccountConnection.ConnectionId'],
				probeCases: [[[0, '1', ['connectionId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/c/[fname]/[hash]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/c/[fname=stringSegment]/[hash=zeroExHex]',
		mappings: [
			{
				id: 'FarcasterCast.UsernameHashPrefix',
				probeAtomPrefixes: ['/farcaster/c/[fname]/[hash]:FarcasterCast.UsernameHashPrefix'],
				probeCases: [[[0, '1', ['fname', 'hash']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/cast/[fid]/[hash]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]',
		mappings: [
			{
				id: 'FarcasterCast.FidHash',
				probeAtomPrefixes: ['/farcaster/cast/[fid]/[hash]:FarcasterCast.FidHash'],
				probeCases: [[[0, '1', ['fid', 'hash']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/cast/[fid]/[hash]/embed/[indexInCast]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/embed/[indexInCast=nonNegativeInteger]',
		mappings: [
			{
				id: 'FarcasterCastEmbed.CastIndexInCast',
				probeAtomPrefixes: ['/farcaster/cast/[fid]/[hash]/embed/[indexInCast]:FarcasterCastEmbed.CastIndexInCast'],
				probeCases: [[[0, '1', ['indexInCast', 'fid', 'hash']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/channel/[channelId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]',
		mappings: [
			{
				id: 'FarcasterChannel.Id',
				probeAtomPrefixes: ['/farcaster/channel/[channelId]:FarcasterChannel.Id'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/channel/[channelId]/casts': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/casts',
		mappings: [
			{
				id: 'FarcasterChannel.Id',
				probeAtomPrefixes: ['/farcaster/channel/[channelId]:FarcasterChannel.Id'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/feed/channel/[channelId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/channel/[channelId=stringSegment]',
		mappings: [
			{
				id: 'FarcasterFeed.ByChannel',
				probeAtomPrefixes: ['/farcaster/feed/channel/[channelId]:FarcasterFeed.ByChannel'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/feed/following/[userId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/following/[userId=farcasterFid]',
		mappings: [
			{
				id: 'FarcasterFeed.Following',
				probeAtomPrefixes: ['/farcaster/feed/following/[userId]:FarcasterFeed.Following'],
				probeCases: [[[0, '1', ['userId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/feed/user/[userId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/user/[userId=farcasterFid]',
		mappings: [
			{
				id: 'FarcasterFeed.ByUser',
				probeAtomPrefixes: ['/farcaster/feed/user/[userId]:FarcasterFeed.ByUser'],
				probeCases: [[[0, '1', ['userId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/user/[userId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]',
		mappings: [
			{
				id: 'FarcasterUser.Fid',
				probeAtomPrefixes: ['/farcaster/user/[userId]:FarcasterUser.Fid'],
				probeCases: [[[0, '1', ['userId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/user/[userId]/casts': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/casts',
		mappings: [
			{
				id: 'FarcasterUser.Fid',
				probeAtomPrefixes: ['/farcaster/user/[userId]:FarcasterUser.Fid'],
				probeCases: [[[0, '1', ['userId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/user/[userId]/verified-address/[protocol]/[address]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/verified-address/[protocol=stringSegment]/[address=stringSegment]',
		mappings: [
			{
				id: 'FarcasterVerifiedAddress.FidProtocolAddress',
				probeAtomPrefixes: ['/farcaster/user/[userId]/verified-address/[protocol]/[address]:FarcasterVerifiedAddress.FidProtocolAddress'],
				probeCases: [[[0, '1', ['userId', 'protocol', 'address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/account/[address]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]',
		mappings: [
			{
				id: 'LensAccount.Address',
				probeAtomPrefixes: ['/lens/account/[address]:LensAccount.Address'],
				probeCases: [[[0, '1', ['address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/account/[address]/manager/[manager]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/manager/[manager=evmAddress]',
		mappings: [
			{
				id: 'LensAccountManager.AccountManager',
				probeAtomPrefixes: ['/lens/account/[address]/manager/[manager]:LensAccountManager.AccountManager'],
				probeCases: [[[0, '1', ['manager', 'address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/account/[address]/posts': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/posts',
		mappings: [
			{
				id: 'LensAccount.Address',
				probeAtomPrefixes: ['/lens/account/[address]:LensAccount.Address'],
				probeCases: [[[0, '1', ['address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/feed/[address]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/feed/[address=evmAddress]',
		mappings: [
			{
				id: 'LensFeed.Address',
				probeAtomPrefixes: ['/lens/feed/[address]:LensFeed.Address'],
				probeCases: [[[0, '1', ['address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/feed/[address]/rule/[ruleId]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/feed/[address=evmAddress]/(lensFeed)/rule/[ruleId=stringSegment]',
		mappings: [
			{
				id: 'LensFeedRule.FeedRuleId',
				probeAtomPrefixes: ['/lens/feed/[address]/rule/[ruleId]:LensFeedRule.FeedRuleId'],
				probeCases: [[[0, '1', ['ruleId', 'address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/namespace/[address]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/namespace/[address=evmAddress]',
		mappings: [
			{
				id: 'LensUsernameNamespace.Address',
				probeAtomPrefixes: ['/lens/namespace/[address]:LensUsernameNamespace.Address'],
				probeCases: [[[0, '1', ['address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/namespace/[address]/rule/[ruleId]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/namespace/[address=evmAddress]/(lensUsernameNamespace)/rule/[ruleId=stringSegment]',
		mappings: [
			{
				id: 'LensUsernameNamespaceRule.NamespaceRuleId',
				probeAtomPrefixes: ['/lens/namespace/[address]/rule/[ruleId]:LensUsernameNamespaceRule.NamespaceRuleId'],
				probeCases: [[[0, '1', ['ruleId', 'address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/post/[postId]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]',
		mappings: [
			{
				id: 'LensPost.Id',
				probeAtomPrefixes: ['/lens/post/[postId]:LensPost.Id'],
				probeCases: [[[0, '1', ['postId']]]],
			},
		],
	},
	'/(social)/(lens)/lens/post/[postId]/comments': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/comments',
		mappings: [
			{
				id: 'LensPost.Id',
				probeAtomPrefixes: ['/lens/post/[postId]:LensPost.Id'],
				probeCases: [[[0, '1', ['postId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/article-version/[eventId]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/article-version/[eventId=stringSegment]',
		mappings: [
			{
				id: 'NostrArticleEvent.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/article-version/[eventId]:NostrArticleEvent.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/article/[pubkey]/[identifier]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/article/[pubkey=stringSegment]/[identifier=stringSegment]',
		mappings: [
			{
				id: 'NostrArticle.CanonicalCoordinate',
				probeAtomPrefixes: ['/nostr/article/[pubkey]/[identifier]:NostrArticle.CanonicalCoordinate'],
				probeCases: [[[0, '1', ['pubkey', 'identifier']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/note/[eventId]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]',
		mappings: [
			{
				id: 'NostrNote.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/note/[eventId]:NostrNote.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/note/[eventId]/reactions': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]/(nostrNote)/reactions',
		mappings: [
			{
				id: 'NostrNote.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/note/[eventId]:NostrNote.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/note/[eventId]/replies': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]/(nostrNote)/replies',
		mappings: [
			{
				id: 'NostrNote.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/note/[eventId]:NostrNote.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/profile-metadata-version/[eventId]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile-metadata-version/[eventId=stringSegment]',
		mappings: [
			{
				id: 'NostrProfileMetadataEvent.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/profile-metadata-version/[eventId]:NostrProfileMetadataEvent.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]',
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				probeAtomPrefixes: ['/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey'],
				probeCases: [[[0, '1', ['pubkey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]/articles': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/articles',
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				probeAtomPrefixes: ['/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey'],
				probeCases: [[[0, '1', ['pubkey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]/notes': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/notes',
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				probeAtomPrefixes: ['/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey'],
				probeCases: [[[0, '1', ['pubkey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]/reposts': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/reposts',
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				probeAtomPrefixes: ['/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey'],
				probeCases: [[[0, '1', ['pubkey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/reaction/[eventId]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/reaction/[eventId=stringSegment]',
		mappings: [
			{
				id: 'NostrReaction.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/reaction/[eventId]:NostrReaction.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/relay/[relayKey]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]',
		parameterEncodingByName: {
			relayKey: 'Opaque',
		},
		mappings: [
			{
				id: 'NostrRelay.RelayUrl',
				probeAtomPrefixes: ['/nostr/relay/[relayKey]:NostrRelay.RelayUrl'],
				probeCases: [[[0, '1', ['relayKey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/repost/[eventId]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/repost/[eventId=stringSegment]',
		mappings: [
			{
				id: 'NostrRepost.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/repost/[eventId]:NostrRepost.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/search/[query]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/search/[query=stringSegment]',
		mappings: [
			{
				id: 'NostrSearchQuery.Query',
				probeAtomPrefixes: ['/nostr/search/[query]:NostrSearchQuery.Query'],
				probeCases: [[[0, '1', ['query']]]],
			},
		],
	},
	'/(social)/(oci)/oci/registry/[registry]/repository/[repository]/manifest/[reference]': {
		routeId: '/(social)/(oci)/oci/registry/[registry=stringSegment]/repository/[repository=stringSegment]/manifest/[reference=stringSegment]',
		parameterEncodingByName: {
			repository: 'Opaque',
			reference: 'Opaque',
		},
		mappings: [
			{
				id: 'OciManifest.RegistryRepositoryReference',
				probeAtomPrefixes: ['/oci/registry/[registry]/repository/[repository]/manifest/[reference]:OciManifest.RegistryRepositoryReference'],
				probeCases: [[[0, '1', ['registry', 'repository', 'reference']]]],
			},
		],
	},
	'/(social)/(oci)/oci/registry/[registry]/repository/[repository]/manifest/[reference]/descriptor/[descriptorKind]/[descriptorIndex]': {
		routeId: '/(social)/(oci)/oci/registry/[registry=stringSegment]/repository/[repository=stringSegment]/manifest/[reference=stringSegment]/(ociManifest)/descriptor/[descriptorKind=stringSegment]/[descriptorIndex=nonNegativeInteger]',
		parameterEncodingByName: {
			repository: 'Opaque',
			reference: 'Opaque',
		},
		mappings: [
			{
				id: 'OciDescriptor.ManifestKindIndex',
				probeAtomPrefixes: ['/oci/registry/[registry]/repository/[repository]/manifest/[reference]/descriptor/[descriptorKind]/[descriptorIndex]:OciDescriptor.ManifestKindIndex'],
				probeCases: [[[0, '1', ['descriptorKind', 'descriptorIndex', 'registry', 'repository', 'reference']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/comment/[fullname]': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditComment.Fullname',
				probeAtomPrefixes: ['/reddit/comment/[fullname]:RedditComment.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/comment/[fullname]/observations': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditComment.Fullname',
				probeAtomPrefixes: ['/reddit/comment/[fullname]:RedditComment.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/comment/[fullname]/replies': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/replies',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditComment.Fullname',
				probeAtomPrefixes: ['/reddit/comment/[fullname]:RedditComment.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/link/[fullname]': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditLink.Fullname',
				probeAtomPrefixes: ['/reddit/link/[fullname]:RedditLink.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/link/[fullname]/comments': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/comments',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditLink.Fullname',
				probeAtomPrefixes: ['/reddit/link/[fullname]:RedditLink.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/link/[fullname]/observations': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditLink.Fullname',
				probeAtomPrefixes: ['/reddit/link/[fullname]:RedditLink.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/r/[name]': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]',
		parameterEncodingByName: {
			name: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditSubreddit.Name',
				probeAtomPrefixes: ['/reddit/r/[name]:RedditSubreddit.Name'],
				probeCases: [[[0, '1', ['name']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/r/[name]/links': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/links',
		parameterEncodingByName: {
			name: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditSubreddit.Name',
				probeAtomPrefixes: ['/reddit/r/[name]:RedditSubreddit.Name'],
				probeCases: [[[0, '1', ['name']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/r/[name]/observations': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations',
		parameterEncodingByName: {
			name: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditSubreddit.Name',
				probeAtomPrefixes: ['/reddit/r/[name]:RedditSubreddit.Name'],
				probeCases: [[[0, '1', ['name']]]],
			},
		],
	},
	'/(social)/(rss)/rss/feed/[feedUrl]': {
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]',
		parameterEncodingByName: {
			feedUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'RssFeed.FeedUrl',
				probeAtomPrefixes: ['/rss/feed/[feedUrl]:RssFeed.FeedUrl'],
				probeCases: [[[0, '1', ['feedUrl']]]],
			},
		],
	},
	'/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]': {
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]',
		parameterEncodingByName: {
			feedUrl: 'Opaque',
			itemIdentity: 'Opaque',
		},
		mappings: [
			{
				id: 'RssItem.FeedIdentity',
				probeAtomPrefixes: ['/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]:RssItem.FeedIdentity'],
				probeCases: [[[0, '1', ['itemIdentityKind', 'itemIdentity', 'feedUrl']]]],
			},
		],
	},
	'/(social)/(rss)/rss/feed/[feedUrl]/items': {
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/items',
		parameterEncodingByName: {
			feedUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'RssFeed.FeedUrl',
				probeAtomPrefixes: ['/rss/feed/[feedUrl]:RssFeed.FeedUrl'],
				probeCases: [[[0, '1', ['feedUrl']]]],
			},
		],
	},
	'/(social)/(x)/x/post/[postId]': {
		routeId: '/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]',
		mappings: [
			{
				id: 'XPost.Id',
				probeAtomPrefixes: ['/x/post/[postId]:XPost.Id'],
				probeCases: [[[0, '1', ['postId']]]],
			},
		],
	},
	'/(social)/(x)/x/post/[postId]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]/(xPost)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'XPost_Timestamp.XPostTimestampMsSource',
				probeAtomPrefixes: ['/x/post/[postId]/observations/[timestampMs]/[source]:XPost_Timestamp.XPostTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'postId']]]],
			},
		],
	},
	'/(social)/(x)/x/user/[userId]': {
		routeId: '/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]',
		mappings: [
			{
				id: 'XUser.Id',
				probeAtomPrefixes: ['/x/user/[userId]:XUser.Id'],
				probeCases: [[[0, '1', ['userId']]]],
			},
		],
	},
	'/(social)/(x)/x/user/[userId]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]/(xUser)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'XUser_Timestamp.XUserTimestampMsSource',
				probeAtomPrefixes: ['/x/user/[userId]/observations/[timestampMs]/[source]:XUser_Timestamp.XUserTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'userId']]]],
			},
		],
	},
	'/(social)/(xmtp)/xmtp/conversation/[conversationId]': {
		routeId: '/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]',
		mappings: [
			{
				id: 'XmtpConversation.Id',
				probeAtomPrefixes: ['/xmtp/conversation/[conversationId]:XmtpConversation.Id'],
				probeCases: [[[0, '1', ['conversationId']]]],
			},
		],
	},
	'/(social)/(xmtp)/xmtp/conversation/[conversationId]/message/[messageId]': {
		routeId: '/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]/(xmtpConversation)/message/[messageId=stringSegment]',
		mappings: [
			{
				id: 'XmtpMessage.ConversationMessageId',
				probeAtomPrefixes: ['/xmtp/conversation/[conversationId]/message/[messageId]:XmtpMessage.ConversationMessageId'],
				probeCases: [[[0, '1', ['messageId', 'conversationId']]]],
			},
		],
	},
	'/(social)/(xmtp)/xmtp/conversation/[conversationId]/messages': {
		routeId: '/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]/(xmtpConversation)/messages',
		mappings: [
			{
				id: 'XmtpConversation.Id',
				probeAtomPrefixes: ['/xmtp/conversation/[conversationId]:XmtpConversation.Id'],
				probeCases: [[[0, '1', ['conversationId']]]],
			},
		],
	},
	'/(social)/(xmtp)/xmtp/conversation/[conversationId]/participant/[inboxId]': {
		routeId: '/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]/(xmtpConversation)/participant/[inboxId=stringSegment]',
		mappings: [
			{
				id: 'XmtpParticipant.ConversationInboxId',
				probeAtomPrefixes: ['/xmtp/conversation/[conversationId]/participant/[inboxId]:XmtpParticipant.ConversationInboxId'],
				probeCases: [[[0, '1', ['inboxId', 'conversationId']]]],
			},
		],
	},
	'/(social)/(xmtp)/xmtp/conversation/[conversationId]/participants': {
		routeId: '/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]/(xmtpConversation)/participants',
		mappings: [
			{
				id: 'XmtpConversation.Id',
				probeAtomPrefixes: ['/xmtp/conversation/[conversationId]:XmtpConversation.Id'],
				probeCases: [[[0, '1', ['conversationId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/channel/[channelId]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]',
		parameterEncodingByName: {
			channelId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeChannel.ChannelId',
				probeAtomPrefixes: ['/youtube/channel/[channelId]:YoutubeChannel.ChannelId'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/channel/[channelId]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		parameterEncodingByName: {
			channelId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeChannel_Timestamp.YoutubeChannelTimestampMsSource',
				probeAtomPrefixes: ['/youtube/channel/[channelId]/observations/[timestampMs]-[source]:YoutubeChannel_Timestamp.YoutubeChannelTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'channelId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/channel/[channelId]/playlists': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/playlists',
		parameterEncodingByName: {
			channelId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeChannel.ChannelId',
				probeAtomPrefixes: ['/youtube/channel/[channelId]:YoutubeChannel.ChannelId'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/channel/[channelId]/videos': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/videos',
		parameterEncodingByName: {
			channelId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeChannel.ChannelId',
				probeAtomPrefixes: ['/youtube/channel/[channelId]:YoutubeChannel.ChannelId'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]',
		parameterEncodingByName: {
			videoId: 'Opaque',
			commentId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeComment.VideoIdCommentId',
				probeAtomPrefixes: ['/youtube/comment/[videoId]/[commentId]:YoutubeComment.VideoIdCommentId'],
				probeCases: [[[0, '1', ['videoId', 'commentId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]/(youtubeComment)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		parameterEncodingByName: {
			videoId: 'Opaque',
			commentId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeComment_Timestamp.YoutubeCommentTimestampMsSource',
				probeAtomPrefixes: ['/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]:YoutubeComment_Timestamp.YoutubeCommentTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'videoId', 'commentId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/playlist/[playlistId]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]',
		parameterEncodingByName: {
			playlistId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubePlaylist.PlaylistId',
				probeAtomPrefixes: ['/youtube/playlist/[playlistId]:YoutubePlaylist.PlaylistId'],
				probeCases: [[[0, '1', ['playlistId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/playlist/[playlistId]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		parameterEncodingByName: {
			playlistId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubePlaylist_Timestamp.YoutubePlaylistTimestampMsSource',
				probeAtomPrefixes: ['/youtube/playlist/[playlistId]/observations/[timestampMs]-[source]:YoutubePlaylist_Timestamp.YoutubePlaylistTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'playlistId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/playlist/[playlistId]/videos': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/videos',
		parameterEncodingByName: {
			playlistId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubePlaylist.PlaylistId',
				probeAtomPrefixes: ['/youtube/playlist/[playlistId]:YoutubePlaylist.PlaylistId'],
				probeCases: [[[0, '1', ['playlistId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/video/[videoId]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]',
		parameterEncodingByName: {
			videoId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeVideo.VideoId',
				probeAtomPrefixes: ['/youtube/video/[videoId]:YoutubeVideo.VideoId'],
				probeCases: [[[0, '1', ['videoId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/video/[videoId]/comments': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/comments',
		parameterEncodingByName: {
			videoId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeVideo.VideoId',
				probeAtomPrefixes: ['/youtube/video/[videoId]:YoutubeVideo.VideoId'],
				probeCases: [[[0, '1', ['videoId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/video/[videoId]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		parameterEncodingByName: {
			videoId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeVideo_Timestamp.YoutubeVideoTimestampMsSource',
				probeAtomPrefixes: ['/youtube/video/[videoId]/observations/[timestampMs]-[source]:YoutubeVideo_Timestamp.YoutubeVideoTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'videoId']]]],
			},
		],
	},
	'/(swarm)/swarm/[reference]': {
		routeId: '/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]',
		mappings: [
			{
				id: 'SwarmResource.ResourceAddress',
				probeAtomPrefixes: ['/swarm/[reference]:SwarmResource.ResourceAddress'],
				probeCases: [[[0, '1', ['reference']]]],
			},
		],
	},
	'/(swarm)/swarm/[reference]/path/[...contentPath]': {
		routeId: '/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]/path/[...contentPath=stringSegment]',
		mappings: [
			{
				id: 'SwarmResource.ResourceAddress',
				probeCaseId: 'path',
				probeAtomPrefixes: ['/swarm/[reference]:SwarmResource.ResourceAddress', '/swarm/[reference]/path/[...contentPath]:SwarmResource.ResourceAddress.path'],
				probeCases: [[[0, '1', ['reference']], [1, '1', ['contentPath']]]],
			},
		],
	},
	'/~/accounts/account/[namespace]:[reference]/[accountAddress]': {
		routeId: '/~/accounts/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAccount.Account',
				probeAtomPrefixes: ['/~/accounts/account/[namespace]:[reference]/[accountAddress]:BlockheadAccount.Account'],
				probeCases: [[[0, '1', ['namespace', 'reference', 'accountAddress']]]],
			},
		],
	},
	'/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]': {
		routeId: '/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]',
		mappings: [
			{
				id: 'EvmActorCoinAllowance.EvmAccountEvmContractSpenderInteropAddress',
				probeAtomPrefixes: ['/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]:EvmActorCoinAllowance.EvmAccountEvmContractSpenderInteropAddress'],
				probeCases: [[[0, '1', ['owner', 'chainId', 'coin', 'spender']]]],
			},
		],
	},
	'/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]/block/[blockNumber]/[source]': {
		routeId: '/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]/(evmActorCoinAllowance)/block/[blockNumber=nonNegativeBigInt]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmActorCoinAllowance_Block.AllowanceBlockNumberSource',
				probeAtomPrefixes: ['/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]/block/[blockNumber]/[source]:EvmActorCoinAllowance_Block.AllowanceBlockNumberSource'],
				probeCases: [[[0, '1', ['blockNumber', 'source', 'owner', 'chainId', 'coin', 'spender']]]],
			},
		],
	},
	'/~/accounts/balance/[chainId]/[owner]/[coin]': {
		routeId: '/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]',
		mappings: [
			{
				id: 'EvmNetworkActorCoinBalance.EvmAccountErc20CoinInstance',
				probeAtomPrefixes: ['/~/accounts/balance/[chainId]/[owner]/[coin]:EvmNetworkActorCoinBalance.EvmAccountErc20CoinInstance'],
				probeCases: [[[0, '1', ['owner', 'chainId', 'coin']]]],
			},
		],
	},
	'/~/accounts/balance/[chainId]/[owner]/[coin]/observations/[timestampMs]/[source]': {
		routeId: '/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/(evmNetworkActorCoinBalance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmNetworkActorCoinBalance_Timestamp.ActorCoinTimestampMsSource',
				probeAtomPrefixes: ['/~/accounts/balance/[chainId]/[owner]/[coin]/observations/[timestampMs]/[source]:EvmNetworkActorCoinBalance_Timestamp.ActorCoinTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'owner', 'chainId', 'coin']]]],
			},
		],
	},
	'/~/accounts/balance/[chainId]/[owner]/native': {
		routeId: '/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/native',
		mappings: [
			{
				id: 'EvmNetworkActorCoinBalance.EvmAccountNativeCoinInstance',
				probeAtomPrefixes: ['/~/accounts/balance/[chainId]/[owner]/native:EvmNetworkActorCoinBalance.EvmAccountNativeCoinInstance'],
				probeCases: [[[0, '1', ['owner', 'chainId']]]],
			},
		],
	},
	'/~/accounts/balance/[chainId]/[owner]/native/block/[blockNumber]': {
		routeId: '/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/native/(evmNetworkActorCoinBalance)/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'EvmNetworkActorCoinBalance_EvmBlock.EvmNetworkActorCoinBalanceEvmBlock',
				probeAtomPrefixes: ['/~/accounts/balance/[chainId]/[owner]/native/block/[blockNumber]:EvmNetworkActorCoinBalance_EvmBlock.EvmNetworkActorCoinBalanceEvmBlock'],
				probeCases: [[[0, '1', ['blockNumber', 'owner', 'chainId']]]],
			},
		],
	},
	'/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]': {
		routeId: '/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]',
		parameterEncodingByName: {
			sourceTxHash: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadBridgeTransaction.AccountSourceTxCreatedAt',
				probeAtomPrefixes: ['/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]:BlockheadBridgeTransaction.AccountSourceTxCreatedAt'],
				probeCases: [[[0, '1', ['createdAt', 'address', 'chainId', 'sourceTxHash']]]],
			},
		],
	},
	'/~/agent-network/[networkId]': {
		routeId: '/~/agent-network/[networkId=stringSegment]',
		mappings: [
			{
				id: '_GlobalAgentNetwork.NetworkId',
				probeAtomPrefixes: ['/~/agent-network/[networkId]:_GlobalAgentNetwork.NetworkId'],
				probeCases: [[[0, '1', ['networkId']]]],
			},
		],
	},
	'/~/agent-network/[networkId]/observations/[timestampMs]/[source]': {
		routeId: '/~/agent-network/[networkId=stringSegment]/(globalAgentNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: '_GlobalAgentNetwork_Timestamp.NetworkTimestampMsSource',
				probeAtomPrefixes: ['/~/agent-network/[networkId]/observations/[timestampMs]/[source]:_GlobalAgentNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'networkId']]]],
			},
		],
	},
	'/~/agent/connection/[connectionId]': {
		routeId: '/~/agent/connection/[connectionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentConnection.ConnectionId',
				probeAtomPrefixes: ['/~/agent/connection/[connectionId]:BlockheadAgentConnection.ConnectionId'],
				probeCases: [[[0, '1', ['connectionId']]]],
			},
		],
	},
	'/~/agent/connection/[connectionId]/observations/[timestampMs]/[source]': {
		routeId: '/~/agent/connection/[connectionId=stringSegment]/(blockheadAgentConnection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentConnection_Timestamp.ConnectionTimestampMsSource',
				probeAtomPrefixes: ['/~/agent/connection/[connectionId]/observations/[timestampMs]/[source]:BlockheadAgentConnection_Timestamp.ConnectionTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId']]]],
			},
		],
	},
	'/~/agent/conversation-turn/[id]': {
		routeId: '/~/agent/conversation-turn/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentConversationTurn.Id',
				probeAtomPrefixes: ['/~/agent/conversation-turn/[id]:BlockheadAgentConversationTurn.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/agent/credential/[credentialId]': {
		routeId: '/~/agent/credential/[credentialId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentCredentialState.CredentialId',
				probeAtomPrefixes: ['/~/agent/credential/[credentialId]:BlockheadAgentCredentialState.CredentialId'],
				probeCases: [[[0, '1', ['credentialId']]]],
			},
		],
	},
	'/~/agent/credential/[credentialId]/observations/[timestampMs]/[source]': {
		routeId: '/~/agent/credential/[credentialId=stringSegment]/(blockheadAgentCredentialState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentCredentialState_Timestamp.CredentialTimestampMsSource',
				probeAtomPrefixes: ['/~/agent/credential/[credentialId]/observations/[timestampMs]/[source]:BlockheadAgentCredentialState_Timestamp.CredentialTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'credentialId']]]],
			},
		],
	},
	'/~/agent/profile/[profileId]': {
		routeId: '/~/agent/profile/[profileId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentProfile.ProfileId',
				probeAtomPrefixes: ['/~/agent/profile/[profileId]:BlockheadAgentProfile.ProfileId'],
				probeCases: [[[0, '1', ['profileId']]]],
			},
		],
	},
	'/~/agent/program-install/[installId]': {
		routeId: '/~/agent/program-install/[installId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentProgramInstall.InstallId',
				probeAtomPrefixes: ['/~/agent/program-install/[installId]:BlockheadAgentProgramInstall.InstallId'],
				probeCases: [[[0, '1', ['installId']]]],
			},
		],
	},
	'/~/agent/program-install/[installId]/observations/[timestampMs]/[source]': {
		routeId: '/~/agent/program-install/[installId=stringSegment]/(blockheadAgentProgramInstall)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentProgramInstall_Timestamp.InstallTimestampMsSource',
				probeAtomPrefixes: ['/~/agent/program-install/[installId]/observations/[timestampMs]/[source]:BlockheadAgentProgramInstall_Timestamp.InstallTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'installId']]]],
			},
		],
	},
	'/~/agents/conversation/[conversationId]': {
		routeId: '/~/agents/conversation/[conversationId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentConversation.Id',
				probeAtomPrefixes: ['/~/agents/conversation/[conversationId]:BlockheadAgentConversation.Id'],
				probeCases: [[[0, '1', ['conversationId']]]],
			},
		],
	},
	'/~/agents/conversation/[conversationId]/turn/[turnId]': {
		routeId: '/~/agents/conversation/[conversationId=stringSegment]/(blockheadAgentConversation)/turn/[turnId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentConversationTurn.ConversationTurnId',
				probeAtomPrefixes: ['/~/agents/conversation/[conversationId]/turn/[turnId]:BlockheadAgentConversationTurn.ConversationTurnId'],
				probeCases: [[[0, '1', ['turnId', 'conversationId']]]],
			},
		],
	},
	'/~/agents/conversation/[conversationId]/turn/[turnId]/provider-call/[indexInTurn]': {
		routeId: '/~/agents/conversation/[conversationId=stringSegment]/(blockheadAgentConversation)/turn/[turnId=stringSegment]/(blockheadAgentConversationTurn)/provider-call/[indexInTurn=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadAgentProviderCall.TurnIndexInTurn',
				probeAtomPrefixes: ['/~/agents/conversation/[conversationId]/turn/[turnId]/provider-call/[indexInTurn]:BlockheadAgentProviderCall.TurnIndexInTurn'],
				probeCases: [[[0, '1', ['indexInTurn', 'turnId', 'conversationId']]]],
			},
		],
	},
	'/~/ai/artifact-catalog/[catalogId]': {
		routeId: '/~/ai/artifact-catalog/[catalogId=stringSegment]',
		mappings: [
			{
				id: '_GlobalAiArtifactCatalog.CatalogId',
				probeAtomPrefixes: ['/~/ai/artifact-catalog/[catalogId]:_GlobalAiArtifactCatalog.CatalogId'],
				probeCases: [[[0, '1', ['catalogId']]]],
			},
		],
	},
	'/~/ai/artifact-catalog/[catalogId]/observations/[timestampMs]/[source]': {
		routeId: '/~/ai/artifact-catalog/[catalogId=stringSegment]/(globalAiArtifactCatalog)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: '_GlobalAiArtifactCatalog_Timestamp.CatalogTimestampMsSource',
				probeAtomPrefixes: ['/~/ai/artifact-catalog/[catalogId]/observations/[timestampMs]/[source]:_GlobalAiArtifactCatalog_Timestamp.CatalogTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'catalogId']]]],
			},
		],
	},
	'/~/ai/model-catalog/[catalogId]': {
		routeId: '/~/ai/model-catalog/[catalogId=stringSegment]',
		mappings: [
			{
				id: '_GlobalAiModelCatalog.CatalogId',
				probeAtomPrefixes: ['/~/ai/model-catalog/[catalogId]:_GlobalAiModelCatalog.CatalogId'],
				probeCases: [[[0, '1', ['catalogId']]]],
			},
		],
	},
	'/~/ai/model-catalog/[catalogId]/observations/[timestampMs]/[source]': {
		routeId: '/~/ai/model-catalog/[catalogId=stringSegment]/(globalAiModelCatalog)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: '_GlobalAiModelCatalog_Timestamp.CatalogTimestampMsSource',
				probeAtomPrefixes: ['/~/ai/model-catalog/[catalogId]/observations/[timestampMs]/[source]:_GlobalAiModelCatalog_Timestamp.CatalogTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'catalogId']]]],
			},
		],
	},
	'/~/algorand/participation-key/[nodeId]/[participationId]': {
		routeId: '/~/algorand/participation-key/[nodeId=stringSegment]/[participationId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAlgorandParticipationKey.NodeIdParticipationId',
				probeAtomPrefixes: ['/~/algorand/participation-key/[nodeId]/[participationId]:BlockheadAlgorandParticipationKey.NodeIdParticipationId'],
				probeCases: [[[0, '1', ['nodeId', 'participationId']]]],
			},
		],
	},
	'/~/algorand/pending-transaction/[nodeId]/[txId]/[observedAtMs]': {
		routeId: '/~/algorand/pending-transaction/[nodeId=stringSegment]/[txId=stringSegment]/[observedAtMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadAlgorandPendingTransaction.NodeIdTxIdObservedAtMs',
				probeAtomPrefixes: ['/~/algorand/pending-transaction/[nodeId]/[txId]/[observedAtMs]:BlockheadAlgorandPendingTransaction.NodeIdTxIdObservedAtMs'],
				probeCases: [[[0, '1', ['nodeId', 'txId', 'observedAtMs']]]],
			},
		],
	},
	'/~/avalanche/node-state/[nodeId]': {
		routeId: '/~/avalanche/node-state/[nodeId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAvalancheNodeState.NodeId',
				probeAtomPrefixes: ['/~/avalanche/node-state/[nodeId]:BlockheadAvalancheNodeState.NodeId'],
				probeCases: [[[0, '1', ['nodeId']]]],
			},
		],
	},
	'/~/avalanche/node-state/[nodeId]/observations/[timestampMs]/[source]': {
		routeId: '/~/avalanche/node-state/[nodeId=stringSegment]/(blockheadAvalancheNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAvalancheNodeState_Timestamp.NodeStateTimestampMsSource',
				probeAtomPrefixes: ['/~/avalanche/node-state/[nodeId]/observations/[timestampMs]/[source]:BlockheadAvalancheNodeState_Timestamp.NodeStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'nodeId']]]],
			},
		],
	},
	'/~/bittorrent/client-state/[clientId]': {
		routeId: '/~/bittorrent/client-state/[clientId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadBitTorrentClientState.ClientId',
				probeAtomPrefixes: ['/~/bittorrent/client-state/[clientId]:BlockheadBitTorrentClientState.ClientId'],
				probeCases: [[[0, '1', ['clientId']]]],
			},
		],
	},
	'/~/bittorrent/client-state/[clientId]/observations/[timestampMs]/[source]': {
		routeId: '/~/bittorrent/client-state/[clientId=stringSegment]/(blockheadBitTorrentClientState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadBitTorrentClientState_Timestamp.ClientStateTimestampMsSource',
				probeAtomPrefixes: ['/~/bittorrent/client-state/[clientId]/observations/[timestampMs]/[source]:BlockheadBitTorrentClientState_Timestamp.ClientStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'clientId']]]],
			},
		],
	},
	'/~/bittorrent/client-state/[clientId]/torrent/[infoHash]/[hashVersion]/observations/[timestampMs]': {
		routeId: '/~/bittorrent/client-state/[clientId=stringSegment]/(blockheadBitTorrentClientState)/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/observations/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadBitTorrentTransfer_Timestamp.ClientTorrentTimestampMs',
				probeAtomPrefixes: ['/~/bittorrent/client-state/[clientId]/torrent/[infoHash]/[hashVersion]/observations/[timestampMs]:BlockheadBitTorrentTransfer_Timestamp.ClientTorrentTimestampMs'],
				probeCases: [[[0, '1', ['infoHash', 'hashVersion', 'timestampMs', 'clientId']]]],
			},
		],
	},
	'/~/bridge/quote/[source]/[quoteRequestHash]/observations/[timestampMs]': {
		routeId: '/~/bridge/quote/[source=stringSegment]/[quoteRequestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'BridgeRouteQuote_Timestamp.SourceQuoteRequestHashTimestampMs',
				probeAtomPrefixes: ['/~/bridge/quote/[source]/[quoteRequestHash]/observations/[timestampMs]:BridgeRouteQuote_Timestamp.SourceQuoteRequestHashTimestampMs'],
				probeCases: [[[0, '1', ['source', 'quoteRequestHash', 'timestampMs']]]],
			},
		],
	},
	'/~/bridge/quote/[source]/[quoteRequestHash]/observations/[timestampMs]/step/[indexInQuote]': {
		routeId: '/~/bridge/quote/[source=stringSegment]/[quoteRequestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/(bridgeRouteQuoteTimestamp)/step/[indexInQuote=nonNegativeInteger]',
		mappings: [
			{
				id: 'BridgeRouteQuoteStep.QuoteIndexInQuote',
				probeAtomPrefixes: ['/~/bridge/quote/[source]/[quoteRequestHash]/observations/[timestampMs]/step/[indexInQuote]:BridgeRouteQuoteStep.QuoteIndexInQuote'],
				probeCases: [[[0, '1', ['indexInQuote', 'source', 'quoteRequestHash', 'timestampMs']]]],
			},
		],
	},
	'/~/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]': {
		routeId: '/~/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]',
		mappings: [
			{
				id: 'BridgeRoute.Quote',
				probeAtomPrefixes: ['/~/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]:BridgeRoute.Quote'],
				probeCases: [[[0, '1', ['fromChainId', 'toChainId', 'fromToken', 'toToken', 'fromAmount', 'fromAddress', 'slippage', 'toAddress']]]],
			},
		],
	},
	'/~/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]': {
		routeId: '/~/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]',
		mappings: [
			{
				id: 'BridgeRouteStep.RouteIndexInRoute',
				probeAtomPrefixes: ['/~/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute'],
				probeCases: [[[0, '1', ['stepIndex', 'fromChainId', 'toChainId', 'fromToken', 'toToken', 'fromAmount', 'fromAddress', 'slippage', 'toAddress']]]],
			},
		],
	},
	'/~/bridge/transfer/[source]/[transferId]': {
		routeId: '/~/bridge/transfer/[source=stringSegment]/[transferId=stringSegment]',
		mappings: [
			{
				id: 'BridgeTransfer.SourceTransferId',
				probeAtomPrefixes: ['/~/bridge/transfer/[source]/[transferId]:BridgeTransfer.SourceTransferId'],
				probeCases: [[[0, '1', ['source', 'transferId']]]],
			},
		],
	},
	'/~/bridge/transfer/[source]/[transferId]/observations/[timestampMs]/[observationSource]/[eventKind]': {
		routeId: '/~/bridge/transfer/[source=stringSegment]/[transferId=stringSegment]/(bridgeTransfer)/observations/[timestampMs=nonNegativeInteger]/[observationSource=stringSegment]/[eventKind=bridgeTransferEventKind]',
		mappings: [
			{
				id: 'BridgeTransfer_Timestamp.TransferTimestampMsSourceEventKind',
				probeAtomPrefixes: ['/~/bridge/transfer/[source]/[transferId]/observations/[timestampMs]/[observationSource]/[eventKind]:BridgeTransfer_Timestamp.TransferTimestampMsSourceEventKind'],
				probeCases: [[[0, '1', ['observationSource', 'eventKind', 'timestampMs', 'source', 'transferId']]]],
			},
		],
	},
	'/~/bridge/transfer/across/[originChainId]/[depositId]': {
		routeId: '/~/bridge/transfer/across/[originChainId=nonNegativeInteger]/[depositId=nonNegativeInteger]',
		mappings: [
			{
				id: 'BridgeTransfer.OriginChainIdDepositId',
				probeAtomPrefixes: ['/~/bridge/transfer/across/[originChainId]/[depositId]:BridgeTransfer.OriginChainIdDepositId'],
				probeCases: [[[0, '1', ['originChainId', 'depositId']]]],
			},
		],
	},
	'/~/bridge/transfer/across/[originChainId]/[depositId]/observations/[timestampMs]/[source]': {
		routeId: '/~/bridge/transfer/across/[originChainId=nonNegativeInteger]/[depositId=nonNegativeInteger]/(bridgeTransfer)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BridgeTransfer_Timestamp.TransferTimestampMsSource',
				probeAtomPrefixes: ['/~/bridge/transfer/across/[originChainId]/[depositId]/observations/[timestampMs]/[source]:BridgeTransfer_Timestamp.TransferTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'originChainId', 'depositId']]]],
			},
		],
	},
	'/~/cashu/token/[id]': {
		routeId: '/~/cashu/token/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadCashuToken.Id',
				probeAtomPrefixes: ['/~/cashu/token/[id]:BlockheadCashuToken.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/cashu/wallet/[walletId]/mint/[mintUrl]/[unit]': {
		routeId: '/~/cashu/wallet/[walletId=stringSegment]/mint/[mintUrl=absoluteUrl]/[unit=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadCashuWalletState.WalletIdMintUrlUnit',
				probeAtomPrefixes: ['/~/cashu/wallet/[walletId]/mint/[mintUrl]/[unit]:BlockheadCashuWalletState.WalletIdMintUrlUnit'],
				probeCases: [[[0, '1', ['walletId', 'mintUrl', 'unit']]]],
			},
		],
	},
	'/~/cashu/wallet/[walletId]/mint/[mintUrl]/[unit]/observations/[timestampMs]/[source]': {
		routeId: '/~/cashu/wallet/[walletId=stringSegment]/mint/[mintUrl=absoluteUrl]/[unit=stringSegment]/(blockheadCashuWalletState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadCashuWalletState_Timestamp.WalletStateTimestampMsSource',
				probeAtomPrefixes: ['/~/cashu/wallet/[walletId]/mint/[mintUrl]/[unit]/observations/[timestampMs]/[source]:BlockheadCashuWalletState_Timestamp.WalletStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId', 'mintUrl', 'unit']]]],
			},
		],
	},
	'/~/cashu/wallet/[walletId]/mint/[mintUrl]/keyset/[keysetId]/proof/[secretHash]': {
		routeId: '/~/cashu/wallet/[walletId=stringSegment]/mint/[mintUrl=absoluteUrl]/keyset/[keysetId=stringSegment]/proof/[secretHash=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadCashuProof.WalletIdMintUrlKeysetIdSecretHash',
				probeAtomPrefixes: ['/~/cashu/wallet/[walletId]/mint/[mintUrl]/keyset/[keysetId]/proof/[secretHash]:BlockheadCashuProof.WalletIdMintUrlKeysetIdSecretHash'],
				probeCases: [[[0, '1', ['walletId', 'mintUrl', 'keysetId', 'secretHash']]]],
			},
		],
	},
	'/~/cashu/wallet/[walletId]/mint/[mintUrl]/keyset/[keysetId]/proof/[secretHash]/observations/[timestampMs]/[source]': {
		routeId: '/~/cashu/wallet/[walletId=stringSegment]/mint/[mintUrl=absoluteUrl]/keyset/[keysetId=stringSegment]/proof/[secretHash=stringSegment]/(blockheadCashuProof)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadCashuProof_Timestamp.ProofTimestampMsSource',
				probeAtomPrefixes: ['/~/cashu/wallet/[walletId]/mint/[mintUrl]/keyset/[keysetId]/proof/[secretHash]/observations/[timestampMs]/[source]:BlockheadCashuProof_Timestamp.ProofTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId', 'mintUrl', 'keysetId', 'secretHash']]]],
			},
		],
	},
	'/~/channel/[channelId]': {
		routeId: '/~/channel/[channelId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadStateChannel.Id',
				probeAtomPrefixes: ['/~/channel/[channelId]:BlockheadStateChannel.Id'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/~/channel/[channelId]/deposit/[accountAddress]': {
		routeId: '/~/channel/[channelId=stringSegment]/(blockheadStateChannel)/deposit/[accountAddress=evmAddress]',
		mappings: [
			{
				id: 'BlockheadStateChannelDeposit.ChannelAccount',
				probeAtomPrefixes: ['/~/channel/[channelId]/deposit/[accountAddress]:BlockheadStateChannelDeposit.ChannelAccount'],
				probeCases: [[[0, '1', ['accountAddress', 'channelId']]]],
			},
		],
	},
	'/~/channel/[channelId]/deposit/[accountAddress]/observations/[timestampMs]/[source]': {
		routeId: '/~/channel/[channelId=stringSegment]/(blockheadStateChannel)/deposit/[accountAddress=evmAddress]/(blockheadStateChannelDeposit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadStateChannelDeposit_Timestamp.DepositTimestampMsSource',
				probeAtomPrefixes: ['/~/channel/[channelId]/deposit/[accountAddress]/observations/[timestampMs]/[source]:BlockheadStateChannelDeposit_Timestamp.DepositTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'accountAddress', 'channelId']]]],
			},
		],
	},
	'/~/channel/[channelId]/observations/[timestampMs]/[source]': {
		routeId: '/~/channel/[channelId=stringSegment]/(blockheadStateChannel)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadStateChannel_Timestamp.ChannelTimestampMsSource',
				probeAtomPrefixes: ['/~/channel/[channelId]/observations/[timestampMs]/[source]:BlockheadStateChannel_Timestamp.ChannelTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'channelId']]]],
			},
		],
	},
	'/~/channel/[channelId]/state/[version]/[stateData]': {
		routeId: '/~/channel/[channelId=stringSegment]/(blockheadStateChannel)/state/[version=nonNegativeInteger]/[stateData=stringSegment]',
		mappings: [
			{
				id: 'BlockheadStateChannelState.ChannelVersionStateData',
				probeAtomPrefixes: ['/~/channel/[channelId]/state/[version]/[stateData]:BlockheadStateChannelState.ChannelVersionStateData'],
				probeCases: [[[0, '1', ['version', 'stateData', 'channelId']]]],
			},
		],
	},
	'/~/channel/[channelId]/transfer/[turnNum]/[fromAddress]/[toAddress]/[amount]': {
		routeId: '/~/channel/[channelId=stringSegment]/(blockheadStateChannel)/transfer/[turnNum=nonNegativeInteger]/[fromAddress=evmAddress]/[toAddress=evmAddress]/[amount=nonNegativeBigInt]',
		mappings: [
			{
				id: 'BlockheadStateChannelTransfer.ChannelTurnNumFromToAmount',
				probeAtomPrefixes: ['/~/channel/[channelId]/transfer/[turnNum]/[fromAddress]/[toAddress]/[amount]:BlockheadStateChannelTransfer.ChannelTurnNumFromToAmount'],
				probeCases: [[[0, '1', ['turnNum', 'fromAddress', 'toAddress', 'amount', 'channelId']]]],
			},
		],
	},
	'/~/codex/connection/[connectionId]/node/[peerId]': {
		routeId: '/~/codex/connection/[connectionId=stringSegment]/node/[peerId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadCodexStorageNodeState.ConnectionIdPeerId',
				probeAtomPrefixes: ['/~/codex/connection/[connectionId]/node/[peerId]:BlockheadCodexStorageNodeState.ConnectionIdPeerId'],
				probeCases: [[[0, '1', ['connectionId', 'peerId']]]],
			},
		],
	},
	'/~/codex/connection/[connectionId]/node/[peerId]/observations/[timestampMs]/[source]': {
		routeId: '/~/codex/connection/[connectionId=stringSegment]/node/[peerId=stringSegment]/(blockheadCodexStorageNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadCodexStorageNodeState_Timestamp.NodeStateTimestampMsSource',
				probeAtomPrefixes: ['/~/codex/connection/[connectionId]/node/[peerId]/observations/[timestampMs]/[source]:BlockheadCodexStorageNodeState_Timestamp.NodeStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId', 'peerId']]]],
			},
		],
	},
	'/~/codex/connection/[connectionId]/node/[peerId]/stored-data/[cid]': {
		routeId: '/~/codex/connection/[connectionId=stringSegment]/node/[peerId=stringSegment]/(blockheadCodexStorageNodeState)/stored-data/[cid=stringSegment]',
		mappings: [
			{
				id: 'BlockheadCodexStoredData.NodeStateCid',
				probeAtomPrefixes: ['/~/codex/connection/[connectionId]/node/[peerId]/stored-data/[cid]:BlockheadCodexStoredData.NodeStateCid'],
				probeCases: [[[0, '1', ['cid', 'connectionId', 'peerId']]]],
			},
		],
	},
	'/~/codex/connection/[connectionId]/node/[peerId]/stored-data/[cid]/observations/[timestampMs]/[source]': {
		routeId: '/~/codex/connection/[connectionId=stringSegment]/node/[peerId=stringSegment]/(blockheadCodexStorageNodeState)/stored-data/[cid=stringSegment]/(blockheadCodexStoredData)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadCodexStoredData_Timestamp.StoredDataTimestampMsSource',
				probeAtomPrefixes: ['/~/codex/connection/[connectionId]/node/[peerId]/stored-data/[cid]/observations/[timestampMs]/[source]:BlockheadCodexStoredData_Timestamp.StoredDataTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'cid', 'connectionId', 'peerId']]]],
			},
		],
	},
	'/~/dashboard/[dashboardId]': {
		routeId: '/~/dashboard/[dashboardId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadPanelTree.Id',
				probeAtomPrefixes: ['/~/dashboard/[dashboardId]:BlockheadPanelTree.Id'],
				probeCases: [[[0, '1', ['dashboardId']]]],
			},
		],
	},
	'/~/ens/name-search/[query]': {
		routeId: '/~/ens/name-search/[query=stringSegment]',
		mappings: [
			{
				id: 'BlockheadEnsNameSearch.Query',
				probeAtomPrefixes: ['/~/ens/name-search/[query]:BlockheadEnsNameSearch.Query'],
				probeCases: [[[0, '1', ['query']]]],
			},
		],
	},
	'/~/evm/abi-catalog/observations/[timestampMs]/[source]': {
		routeId: '/~/evm/abi-catalog/(globalEvmAbiCatalog)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: '_GlobalEvmAbiCatalog_Timestamp.HubTimestampMsSource',
				probeAtomPrefixes: ['/~/evm/abi-catalog/observations/[timestampMs]/[source]:_GlobalEvmAbiCatalog_Timestamp.HubTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source']]]],
			},
		],
	},
	'/~/fedimint/client/[clientId]/federation/[federationId]': {
		routeId: '/~/fedimint/client/[clientId=stringSegment]/federation/[federationId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadFedimintClientState.ClientIdFederationId',
				probeAtomPrefixes: ['/~/fedimint/client/[clientId]/federation/[federationId]:BlockheadFedimintClientState.ClientIdFederationId'],
				probeCases: [[[0, '1', ['clientId', 'federationId']]]],
			},
		],
	},
	'/~/fedimint/client/[clientId]/federation/[federationId]/observations/[timestampMs]/[source]': {
		routeId: '/~/fedimint/client/[clientId=stringSegment]/federation/[federationId=stringSegment]/(blockheadFedimintClientState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadFedimintClientState_Timestamp.ClientStateTimestampMsSource',
				probeAtomPrefixes: ['/~/fedimint/client/[clientId]/federation/[federationId]/observations/[timestampMs]/[source]:BlockheadFedimintClientState_Timestamp.ClientStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'clientId', 'federationId']]]],
			},
		],
	},
	'/~/filecoin/node/[nodeId]/pending-message/[messageCid]/[observedAtMs]': {
		routeId: '/~/filecoin/node/[nodeId=stringSegment]/pending-message/[messageCid=stringSegment]/[observedAtMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadFilecoinPendingMessage.NodeIdMessageCidObservedAtMs',
				probeAtomPrefixes: ['/~/filecoin/node/[nodeId]/pending-message/[messageCid]/[observedAtMs]:BlockheadFilecoinPendingMessage.NodeIdMessageCidObservedAtMs'],
				probeCases: [[[0, '1', ['nodeId', 'messageCid', 'observedAtMs']]]],
			},
		],
	},
	'/~/intent/order/[id]': {
		routeId: '/~/intent/order/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadIntentOrder.Id',
				probeAtomPrefixes: ['/~/intent/order/[id]:BlockheadIntentOrder.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/intent/order/[id]/observations/[timestampMs]/[source]': {
		routeId: '/~/intent/order/[id=stringSegment]/(blockheadIntentOrder)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadIntentOrder_Timestamp.OrderTimestampMsSource',
				probeAtomPrefixes: ['/~/intent/order/[id]/observations/[timestampMs]/[source]:BlockheadIntentOrder_Timestamp.OrderTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'id']]]],
			},
		],
	},
	'/~/intent/quote/[id]': {
		routeId: '/~/intent/quote/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadIntentQuote.Id',
				probeAtomPrefixes: ['/~/intent/quote/[id]:BlockheadIntentQuote.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/intent/quote/[id]/observations/[timestampMs]/[source]': {
		routeId: '/~/intent/quote/[id=stringSegment]/(blockheadIntentQuote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadIntentQuote_Timestamp.QuoteTimestampMsSource',
				probeAtomPrefixes: ['/~/intent/quote/[id]/observations/[timestampMs]/[source]:BlockheadIntentQuote_Timestamp.QuoteTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'id']]]],
			},
		],
	},
	'/~/litecoin-mweb/wallet/[walletId]/output-state/[commitment]': {
		routeId: '/~/litecoin-mweb/wallet/[walletId=stringSegment]/output-state/[commitment=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLitecoinMwebOutputState.WalletIdCommitment',
				probeAtomPrefixes: ['/~/litecoin-mweb/wallet/[walletId]/output-state/[commitment]:BlockheadLitecoinMwebOutputState.WalletIdCommitment'],
				probeCases: [[[0, '1', ['walletId', 'commitment']]]],
			},
		],
	},
	'/~/litecoin-mweb/wallet/[walletId]/output-state/[commitment]/observations/[timestampMs]/[source]': {
		routeId: '/~/litecoin-mweb/wallet/[walletId=stringSegment]/output-state/[commitment=stringSegment]/(blockheadLitecoinMwebOutputState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLitecoinMwebOutputState_Timestamp.OutputStateTimestampMsSource',
				probeAtomPrefixes: ['/~/litecoin-mweb/wallet/[walletId]/output-state/[commitment]/observations/[timestampMs]/[source]:BlockheadLitecoinMwebOutputState_Timestamp.OutputStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId', 'commitment']]]],
			},
		],
	},
	'/~/logos/connection/[connectionId]/node-state/[peerId]': {
		routeId: '/~/logos/connection/[connectionId=stringSegment]/node-state/[peerId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLogosBlockchainNodeState.ConnectionIdPeerId',
				probeAtomPrefixes: ['/~/logos/connection/[connectionId]/node-state/[peerId]:BlockheadLogosBlockchainNodeState.ConnectionIdPeerId'],
				probeCases: [[[0, '1', ['connectionId', 'peerId']]]],
			},
		],
	},
	'/~/logos/connection/[connectionId]/node-state/[peerId]/observations/[timestampMs]/[source]': {
		routeId: '/~/logos/connection/[connectionId=stringSegment]/node-state/[peerId=stringSegment]/(blockheadLogosBlockchainNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLogosBlockchainNodeState_Timestamp.NodeStateTimestampMsSource',
				probeAtomPrefixes: ['/~/logos/connection/[connectionId]/node-state/[peerId]/observations/[timestampMs]/[source]:BlockheadLogosBlockchainNodeState_Timestamp.NodeStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId', 'peerId']]]],
			},
		],
	},
	'/~/logos/connection/[connectionId]/node-state/[peerId]/wallet-key/[publicKey]': {
		routeId: '/~/logos/connection/[connectionId=stringSegment]/node-state/[peerId=stringSegment]/(blockheadLogosBlockchainNodeState)/wallet-key/[publicKey=zeroExHex]',
		mappings: [
			{
				id: 'BlockheadLogosBlockchainWalletKeyState.NodeStatePublicKey',
				probeAtomPrefixes: ['/~/logos/connection/[connectionId]/node-state/[peerId]/wallet-key/[publicKey]:BlockheadLogosBlockchainWalletKeyState.NodeStatePublicKey'],
				probeCases: [[[0, '1', ['publicKey', 'connectionId', 'peerId']]]],
			},
		],
	},
	'/~/logos/connection/[connectionId]/node-state/[peerId]/wallet-key/[publicKey]/observations/[timestampMs]/[source]': {
		routeId: '/~/logos/connection/[connectionId=stringSegment]/node-state/[peerId=stringSegment]/(blockheadLogosBlockchainNodeState)/wallet-key/[publicKey=zeroExHex]/(blockheadLogosBlockchainWalletKeyState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLogosBlockchainWalletKeyState_Timestamp.WalletKeyStateTimestampMsSource',
				probeAtomPrefixes: ['/~/logos/connection/[connectionId]/node-state/[peerId]/wallet-key/[publicKey]/observations/[timestampMs]/[source]:BlockheadLogosBlockchainWalletKeyState_Timestamp.WalletKeyStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'publicKey', 'connectionId', 'peerId']]]],
			},
		],
	},
	'/~/manage/source/[sourceId]': {
		routeId: '/~/manage/source/[sourceId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSource.Id',
				probeAtomPrefixes: ['/~/manage/source/[sourceId]:BlockheadSource.Id'],
				probeCases: [[[0, '1', ['sourceId']]]],
			},
		],
	},
	'/~/manage/source/[sourceId]/endpoint/[bindingId]/[endpointIndex]': {
		routeId: '/~/manage/source/[sourceId=stringSegment]/(blockheadSource)/endpoint/[bindingId=stringSegment]/[endpointIndex=nonNegativeInteger]',
		parameterEncodingByName: {
			bindingId: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadSourceEndpoint.SourceBindingIdEndpointIndex',
				probeAtomPrefixes: ['/~/manage/source/[sourceId]/endpoint/[bindingId]/[endpointIndex]:BlockheadSourceEndpoint.SourceBindingIdEndpointIndex'],
				probeCases: [[[0, '1', ['bindingId', 'endpointIndex', 'sourceId']]]],
			},
		],
	},
	'/~/manage/source/[sourceId]/observations/[timestampMs]': {
		routeId: '/~/manage/source/[sourceId=stringSegment]/(blockheadSource)/observations/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadSource_Timestamp.SourceTimestampMs',
				probeAtomPrefixes: ['/~/manage/source/[sourceId]/observations/[timestampMs]:BlockheadSource_Timestamp.SourceTimestampMs'],
				probeCases: [[[0, '1', ['timestampMs', 'sourceId']]]],
			},
		],
	},
	'/~/media/ingest/[ingestId]': {
		routeId: '/~/media/ingest/[ingestId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLocalMediaIngest.IngestId',
				probeAtomPrefixes: ['/~/media/ingest/[ingestId]:BlockheadLocalMediaIngest.IngestId'],
				probeCases: [[[0, '1', ['ingestId']]]],
			},
		],
	},
	'/~/media/ingest/[ingestId]/observations/[timestampMs]/[source]': {
		routeId: '/~/media/ingest/[ingestId=stringSegment]/(blockheadLocalMediaIngest)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLocalMediaIngest_Timestamp.IngestTimestampMsSource',
				probeAtomPrefixes: ['/~/media/ingest/[ingestId]/observations/[timestampMs]/[source]:BlockheadLocalMediaIngest_Timestamp.IngestTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'ingestId']]]],
			},
		],
	},
	'/~/monero/wallet/[walletId]/output-state/[txHash]/[outputIndex]': {
		routeId: '/~/monero/wallet/[walletId=stringSegment]/output-state/[txHash=stringSegment]/[outputIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadMoneroOutputState.WalletIdTxHashOutputIndex',
				probeAtomPrefixes: ['/~/monero/wallet/[walletId]/output-state/[txHash]/[outputIndex]:BlockheadMoneroOutputState.WalletIdTxHashOutputIndex'],
				probeCases: [[[0, '1', ['walletId', 'txHash', 'outputIndex']]]],
			},
		],
	},
	'/~/monero/wallet/[walletId]/output-state/[txHash]/[outputIndex]/observations/[timestampMs]/[source]': {
		routeId: '/~/monero/wallet/[walletId=stringSegment]/output-state/[txHash=stringSegment]/[outputIndex=nonNegativeInteger]/(blockheadMoneroOutputState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadMoneroOutputState_Timestamp.OutputStateTimestampMsSource',
				probeAtomPrefixes: ['/~/monero/wallet/[walletId]/output-state/[txHash]/[outputIndex]/observations/[timestampMs]/[source]:BlockheadMoneroOutputState_Timestamp.OutputStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId', 'txHash', 'outputIndex']]]],
			},
		],
	},
	'/~/monero/wallet/[walletId]/state': {
		routeId: '/~/monero/wallet/[walletId=stringSegment]/state',
		mappings: [
			{
				id: 'BlockheadMoneroWalletState.WalletId',
				probeAtomPrefixes: ['/~/monero/wallet/[walletId]/state:BlockheadMoneroWalletState.WalletId'],
				probeCases: [[[0, '1', ['walletId']]]],
			},
		],
	},
	'/~/monero/wallet/[walletId]/state/observations/[timestampMs]/[source]': {
		routeId: '/~/monero/wallet/[walletId=stringSegment]/state/(blockheadMoneroWalletState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadMoneroWalletState_Timestamp.WalletStateTimestampMsSource',
				probeAtomPrefixes: ['/~/monero/wallet/[walletId]/state/observations/[timestampMs]/[source]:BlockheadMoneroWalletState_Timestamp.WalletStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId']]]],
			},
		],
	},
	'/~/monero/wallet/[walletId]/subaddress-state/[accountIndex]/[addressIndex]': {
		routeId: '/~/monero/wallet/[walletId=stringSegment]/subaddress-state/[accountIndex=nonNegativeInteger]/[addressIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadMoneroSubaddressState.WalletIdAccountIndexAddressIndex',
				probeAtomPrefixes: ['/~/monero/wallet/[walletId]/subaddress-state/[accountIndex]/[addressIndex]:BlockheadMoneroSubaddressState.WalletIdAccountIndexAddressIndex'],
				probeCases: [[[0, '1', ['walletId', 'accountIndex', 'addressIndex']]]],
			},
		],
	},
	'/~/monero/wallet/[walletId]/subaddress-state/[accountIndex]/[addressIndex]/observations/[timestampMs]/[source]': {
		routeId: '/~/monero/wallet/[walletId=stringSegment]/subaddress-state/[accountIndex=nonNegativeInteger]/[addressIndex=nonNegativeInteger]/(blockheadMoneroSubaddressState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadMoneroSubaddressState_Timestamp.SubaddressStateTimestampMsSource',
				probeAtomPrefixes: ['/~/monero/wallet/[walletId]/subaddress-state/[accountIndex]/[addressIndex]/observations/[timestampMs]/[source]:BlockheadMoneroSubaddressState_Timestamp.SubaddressStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId', 'accountIndex', 'addressIndex']]]],
			},
		],
	},
	'/~/monero/wallet/[walletId]/transfer-state/[txHash]/[transferIndex]': {
		routeId: '/~/monero/wallet/[walletId=stringSegment]/transfer-state/[txHash=stringSegment]/[transferIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadMoneroTransferState.WalletIdTxHashTransferIndex',
				probeAtomPrefixes: ['/~/monero/wallet/[walletId]/transfer-state/[txHash]/[transferIndex]:BlockheadMoneroTransferState.WalletIdTxHashTransferIndex'],
				probeCases: [[[0, '1', ['walletId', 'txHash', 'transferIndex']]]],
			},
		],
	},
	'/~/monero/wallet/[walletId]/transfer-state/[txHash]/[transferIndex]/observations/[timestampMs]/[source]': {
		routeId: '/~/monero/wallet/[walletId=stringSegment]/transfer-state/[txHash=stringSegment]/[transferIndex=nonNegativeInteger]/(blockheadMoneroTransferState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadMoneroTransferState_Timestamp.TransferStateTimestampMsSource',
				probeAtomPrefixes: ['/~/monero/wallet/[walletId]/transfer-state/[txHash]/[transferIndex]/observations/[timestampMs]/[source]:BlockheadMoneroTransferState_Timestamp.TransferStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId', 'txHash', 'transferIndex']]]],
			},
		],
	},
	'/~/multiplayer/contact/[contactId]': {
		routeId: '/~/multiplayer/contact/[contactId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadRoomPeer.Id',
				probeAtomPrefixes: ['/~/multiplayer/contact/[contactId]:BlockheadRoomPeer.Id'],
				probeCases: [[[0, '1', ['contactId']]]],
			},
		],
	},
	'/~/multiplayer/room/[roomId]': {
		routeId: '/~/multiplayer/room/[roomId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadRoom.Id',
				probeAtomPrefixes: ['/~/multiplayer/room/[roomId]:BlockheadRoom.Id'],
				probeCases: [[[0, '1', ['roomId']]]],
			},
		],
	},
	'/~/panel-tree/[treeId]/panel/[panelId]': {
		routeId: '/~/panel-tree/[treeId=stringSegment]/panel/[panelId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadPanel.TreeIdPanelId',
				probeAtomPrefixes: ['/~/panel-tree/[treeId]/panel/[panelId]:BlockheadPanel.TreeIdPanelId'],
				probeCases: [[[0, '1', ['treeId', 'panelId']]]],
			},
		],
	},
	'/~/payjoin/session/[sessionId]': {
		routeId: '/~/payjoin/session/[sessionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadPayjoinSession.SessionId',
				probeAtomPrefixes: ['/~/payjoin/session/[sessionId]:BlockheadPayjoinSession.SessionId'],
				probeCases: [[[0, '1', ['sessionId']]]],
			},
		],
	},
	'/~/pyth/feed/[priceFeedId]/[channel]': {
		routeId: '/~/pyth/feed/[priceFeedId=zeroExHex]/[channel=stringSegment]',
		mappings: [
			{
				id: 'PythPriceFeed.PriceFeedIdChannel',
				probeAtomPrefixes: ['/~/pyth/feed/[priceFeedId]/[channel]:PythPriceFeed.PriceFeedIdChannel'],
				probeCases: [[[0, '1', ['priceFeedId', 'channel']]]],
			},
		],
	},
	'/~/pyth/feed/[priceFeedId]/[channel]/observations/[publishTimeMs]/[source]': {
		routeId: '/~/pyth/feed/[priceFeedId=zeroExHex]/[channel=stringSegment]/(pythPriceFeed)/observations/[publishTimeMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'PythPriceFeed_Timestamp.FeedPublishTimeMsSource',
				probeAtomPrefixes: ['/~/pyth/feed/[priceFeedId]/[channel]/observations/[publishTimeMs]/[source]:PythPriceFeed_Timestamp.FeedPublishTimeMsSource'],
				probeCases: [[[0, '1', ['publishTimeMs', 'source', 'priceFeedId', 'channel']]]],
			},
		],
	},
	'/~/radicle/node-state/[connectionId]/[nodeId]': {
		routeId: '/~/radicle/node-state/[connectionId=stringSegment]/[nodeId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadRadicleNodeState.ConnectionIdNodeId',
				probeAtomPrefixes: ['/~/radicle/node-state/[connectionId]/[nodeId]:BlockheadRadicleNodeState.ConnectionIdNodeId'],
				probeCases: [[[0, '1', ['connectionId', 'nodeId']]]],
			},
		],
	},
	'/~/radicle/node-state/[connectionId]/[nodeId]/inventory/[timestampMs]/[source]': {
		routeId: '/~/radicle/node-state/[connectionId=stringSegment]/[nodeId=stringSegment]/(blockheadRadicleNodeState)/inventory/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadRadicleNodeInventory_Timestamp.NodeTimestampMsSource',
				probeAtomPrefixes: ['/~/radicle/node-state/[connectionId]/[nodeId]/inventory/[timestampMs]/[source]:BlockheadRadicleNodeInventory_Timestamp.NodeTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId', 'nodeId']]]],
			},
		],
	},
	'/~/radicle/node-state/[connectionId]/[nodeId]/observations/[timestampMs]/[source]': {
		routeId: '/~/radicle/node-state/[connectionId=stringSegment]/[nodeId=stringSegment]/(blockheadRadicleNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadRadicleNodeState_Timestamp.NodeStateTimestampMsSource',
				probeAtomPrefixes: ['/~/radicle/node-state/[connectionId]/[nodeId]/observations/[timestampMs]/[source]:BlockheadRadicleNodeState_Timestamp.NodeStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId', 'nodeId']]]],
			},
		],
	},
	'/~/radicle/node-state/[connectionId]/[nodeId]/peer/[peerNodeId]': {
		routeId: '/~/radicle/node-state/[connectionId=stringSegment]/[nodeId=stringSegment]/(blockheadRadicleNodeState)/peer/[peerNodeId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadRadiclePeer.NodePeerNodeId',
				probeAtomPrefixes: ['/~/radicle/node-state/[connectionId]/[nodeId]/peer/[peerNodeId]:BlockheadRadiclePeer.NodePeerNodeId'],
				probeCases: [[[0, '1', ['peerNodeId', 'connectionId', 'nodeId']]]],
			},
		],
	},
	'/~/radicle/sync-session/[sessionId]': {
		routeId: '/~/radicle/sync-session/[sessionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadRadicleSyncSession.SessionId',
				probeAtomPrefixes: ['/~/radicle/sync-session/[sessionId]:BlockheadRadicleSyncSession.SessionId'],
				probeCases: [[[0, '1', ['sessionId']]]],
			},
		],
	},
	'/~/services/agent/[chainId]/[contractAddress]/[tokenId]': {
		routeId: '/~/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]',
		mappings: [
			{
				id: 'EvmNft.EvmContractTokenId',
				projectionEntity: 'EvmNft',
				probeAtomPrefixes: ['/~/services/agent/[chainId]/[contractAddress]/[tokenId]:EvmNft.EvmContractTokenId'],
				probeCases: [[[0, '1', ['tokenId', 'chainId', 'contractAddress']]]],
				projectionPath: [
					'Eip8004Registration',
				],
			},
		],
	},
	'/~/session/[sessionId]': {
		routeId: '/~/session/[sessionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSession.Id',
				probeAtomPrefixes: ['/~/session/[sessionId]:BlockheadSession.Id'],
				probeCases: [[[0, '1', ['sessionId']]]],
			},
		],
	},
	'/~/session/[sessionId]/action/[actionId]': {
		routeId: '/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSessionAction.SessionIdActionId',
				probeAtomPrefixes: ['/~/session/[sessionId]/action/[actionId]:BlockheadSessionAction.SessionIdActionId'],
				probeCases: [[[0, '1', ['sessionId', 'actionId']]]],
			},
		],
	},
	'/~/session/[sessionId]/action/[actionId]/outcome/[outcomeId]': {
		routeId: '/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]/(blockheadSessionAction)/outcome/[outcomeId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadActionOutcome.SessionIdActionIdOutcomeId',
				probeAtomPrefixes: ['/~/session/[sessionId]/action/[actionId]/outcome/[outcomeId]:BlockheadActionOutcome.SessionIdActionIdOutcomeId'],
				probeCases: [[[0, '1', ['sessionId', 'actionId', 'outcomeId']]]],
			},
		],
	},
	'/~/session/[sessionId]/action/[actionId]/outcome/[outcomeId]/observations/[timestampMs]/[source]': {
		routeId: '/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]/(blockheadSessionAction)/outcome/[outcomeId=stringSegment]/(blockheadActionOutcome)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadActionOutcome_Timestamp.OutcomeTimestampMsSource',
				probeAtomPrefixes: ['/~/session/[sessionId]/action/[actionId]/outcome/[outcomeId]/observations/[timestampMs]/[source]:BlockheadActionOutcome_Timestamp.OutcomeTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'sessionId', 'actionId', 'outcomeId']]]],
			},
		],
	},
	'/~/session/[sessionId]/action/[actionId]/readiness-check/[checkId]': {
		routeId: '/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]/(blockheadSessionAction)/readiness-check/[checkId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadActionReadinessCheck.SessionIdActionIdCheckId',
				probeAtomPrefixes: ['/~/session/[sessionId]/action/[actionId]/readiness-check/[checkId]:BlockheadActionReadinessCheck.SessionIdActionIdCheckId'],
				probeCases: [[[0, '1', ['sessionId', 'actionId', 'checkId']]]],
			},
		],
	},
	'/~/session/[sessionId]/action/[actionId]/readiness-check/[checkId]/observations/[timestampMs]/[source]': {
		routeId: '/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]/(blockheadSessionAction)/readiness-check/[checkId=stringSegment]/(blockheadActionReadinessCheck)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadActionReadinessCheck_Timestamp.ReadinessCheckTimestampMsSource',
				probeAtomPrefixes: ['/~/session/[sessionId]/action/[actionId]/readiness-check/[checkId]/observations/[timestampMs]/[source]:BlockheadActionReadinessCheck_Timestamp.ReadinessCheckTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'sessionId', 'actionId', 'checkId']]]],
			},
		],
	},
	'/~/session/[sessionId]/bridge-intent/[actionId]': {
		routeId: '/~/session/[sessionId=stringSegment]/(blockheadSession)/bridge-intent/[actionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadBridgeIntent.SessionIdActionId',
				probeAtomPrefixes: ['/~/session/[sessionId]/bridge-intent/[actionId]:BlockheadBridgeIntent.SessionIdActionId'],
				probeCases: [[[0, '1', ['sessionId', 'actionId']]]],
			},
		],
	},
	'/~/session/[sessionId]/intent-invocation/[invocationId]': {
		routeId: '/~/session/[sessionId=stringSegment]/(blockheadSession)/intent-invocation/[invocationId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadIntentInvocation.SessionIdInvocationId',
				probeAtomPrefixes: ['/~/session/[sessionId]/intent-invocation/[invocationId]:BlockheadIntentInvocation.SessionIdInvocationId'],
				probeCases: [[[0, '1', ['sessionId', 'invocationId']]]],
			},
		],
	},
	'/~/session/[sessionId]/swap-intent/[actionId]': {
		routeId: '/~/session/[sessionId=stringSegment]/(blockheadSession)/swap-intent/[actionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSwapIntent.SessionIdActionId',
				probeAtomPrefixes: ['/~/session/[sessionId]/swap-intent/[actionId]:BlockheadSwapIntent.SessionIdActionId'],
				probeCases: [[[0, '1', ['sessionId', 'actionId']]]],
			},
		],
	},
	'/~/session/[sessionId]/transfer-intent/[actionId]': {
		routeId: '/~/session/[sessionId=stringSegment]/(blockheadSession)/transfer-intent/[actionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadTransferIntent.SessionIdActionId',
				probeAtomPrefixes: ['/~/session/[sessionId]/transfer-intent/[actionId]:BlockheadTransferIntent.SessionIdActionId'],
				probeCases: [[[0, '1', ['sessionId', 'actionId']]]],
			},
		],
	},
	'/~/session/simulation/[id]': {
		routeId: '/~/session/simulation/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSessionSimulation.Id',
				probeAtomPrefixes: ['/~/session/simulation/[id]:BlockheadSessionSimulation.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/session/simulation/[simulationId]/call/[callPath]': {
		routeId: '/~/session/simulation/[simulationId=stringSegment]/call/[callPath=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSessionSimulationCall.SimulationIdCallPath',
				probeAtomPrefixes: ['/~/session/simulation/[simulationId]/call/[callPath]:BlockheadSessionSimulationCall.SimulationIdCallPath'],
				probeCases: [[[0, '1', ['simulationId', 'callPath']]]],
			},
		],
	},
	'/~/session/simulation/[simulationId]/log/[logIndex]': {
		routeId: '/~/session/simulation/[simulationId=stringSegment]/log/[logIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadSessionSimulationLog.SimulationIdLogIndex',
				probeAtomPrefixes: ['/~/session/simulation/[simulationId]/log/[logIndex]:BlockheadSessionSimulationLog.SimulationIdLogIndex'],
				probeCases: [[[0, '1', ['simulationId', 'logIndex']]]],
			},
		],
	},
	'/~/shared-address/[id]': {
		routeId: '/~/shared-address/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSharedAddress.Id',
				probeAtomPrefixes: ['/~/shared-address/[id]:BlockheadSharedAddress.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/siwe/challenge/[id]': {
		routeId: '/~/siwe/challenge/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSiweChallenge.Id',
				probeAtomPrefixes: ['/~/siwe/challenge/[id]:BlockheadSiweChallenge.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/snapshot/proposal/[proposalId]': {
		routeId: '/~/snapshot/proposal/[proposalId=stringSegment]',
		parameterEncodingByName: {
			proposalId: 'Opaque',
		},
		mappings: [
			{
				id: 'SnapshotProposal.ProposalId',
				probeAtomPrefixes: ['/~/snapshot/proposal/[proposalId]:SnapshotProposal.ProposalId'],
				probeCases: [[[0, '1', ['proposalId']]]],
			},
		],
	},
	'/~/snapshot/proposal/[proposalId]/votes': {
		routeId: '/~/snapshot/proposal/[proposalId=stringSegment]/(snapshotProposal)/votes',
		parameterEncodingByName: {
			proposalId: 'Opaque',
		},
		mappings: [
			{
				id: 'SnapshotProposal.ProposalId',
				probeAtomPrefixes: ['/~/snapshot/proposal/[proposalId]:SnapshotProposal.ProposalId'],
				probeCases: [[[0, '1', ['proposalId']]]],
			},
		],
	},
	'/~/snapshot/space/[spaceId]': {
		routeId: '/~/snapshot/space/[spaceId=stringSegment]',
		parameterEncodingByName: {
			spaceId: 'Opaque',
		},
		mappings: [
			{
				id: 'SnapshotSpace.SpaceId',
				probeAtomPrefixes: ['/~/snapshot/space/[spaceId]:SnapshotSpace.SpaceId'],
				probeCases: [[[0, '1', ['spaceId']]]],
			},
		],
	},
	'/~/snapshot/space/[spaceId]/proposals': {
		routeId: '/~/snapshot/space/[spaceId=stringSegment]/(snapshotSpace)/proposals',
		parameterEncodingByName: {
			spaceId: 'Opaque',
		},
		mappings: [
			{
				id: 'SnapshotSpace.SpaceId',
				probeAtomPrefixes: ['/~/snapshot/space/[spaceId]:SnapshotSpace.SpaceId'],
				probeCases: [[[0, '1', ['spaceId']]]],
			},
		],
	},
	'/~/snapshot/vote/[voteId]': {
		routeId: '/~/snapshot/vote/[voteId=stringSegment]',
		parameterEncodingByName: {
			voteId: 'Opaque',
		},
		mappings: [
			{
				id: 'SnapshotVote.VoteId',
				probeAtomPrefixes: ['/~/snapshot/vote/[voteId]:SnapshotVote.VoteId'],
				probeCases: [[[0, '1', ['voteId']]]],
			},
		],
	},
	'/~/social-post/session/[id]': {
		routeId: '/~/social-post/session/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSocialPostSession.Id',
				probeAtomPrefixes: ['/~/social-post/session/[id]:BlockheadSocialPostSession.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/tally/governor/[governorId]': {
		routeId: '/~/tally/governor/[governorId=stringSegment]',
		parameterEncodingByName: {
			governorId: 'Opaque',
		},
		mappings: [
			{
				id: 'TallyGovernor.GovernorId',
				probeAtomPrefixes: ['/~/tally/governor/[governorId]:TallyGovernor.GovernorId'],
				probeCases: [[[0, '1', ['governorId']]]],
			},
		],
	},
	'/~/tally/governor/[governorId]/proposals': {
		routeId: '/~/tally/governor/[governorId=stringSegment]/(tallyGovernor)/proposals',
		parameterEncodingByName: {
			governorId: 'Opaque',
		},
		mappings: [
			{
				id: 'TallyGovernor.GovernorId',
				probeAtomPrefixes: ['/~/tally/governor/[governorId]:TallyGovernor.GovernorId'],
				probeCases: [[[0, '1', ['governorId']]]],
			},
		],
	},
	'/~/tally/proposal/[proposalId]': {
		routeId: '/~/tally/proposal/[proposalId=stringSegment]',
		parameterEncodingByName: {
			proposalId: 'Opaque',
		},
		mappings: [
			{
				id: 'TallyProposal.ProposalId',
				probeAtomPrefixes: ['/~/tally/proposal/[proposalId]:TallyProposal.ProposalId'],
				probeCases: [[[0, '1', ['proposalId']]]],
			},
		],
	},
	'/~/tally/proposal/[proposalId]/executable-call/[index]': {
		routeId: '/~/tally/proposal/[proposalId=stringSegment]/(tallyProposal)/executable-call/[index=nonNegativeInteger]',
		parameterEncodingByName: {
			proposalId: 'Opaque',
		},
		mappings: [
			{
				id: 'TallyProposalExecutableCall.ProposalIndex',
				probeAtomPrefixes: ['/~/tally/proposal/[proposalId]/executable-call/[index]:TallyProposalExecutableCall.ProposalIndex'],
				probeCases: [[[0, '1', ['index', 'proposalId']]]],
			},
		],
	},
	'/~/tally/proposal/[proposalId]/executable-calls': {
		routeId: '/~/tally/proposal/[proposalId=stringSegment]/(tallyProposal)/executable-calls',
		parameterEncodingByName: {
			proposalId: 'Opaque',
		},
		mappings: [
			{
				id: 'TallyProposal.ProposalId',
				probeAtomPrefixes: ['/~/tally/proposal/[proposalId]:TallyProposal.ProposalId'],
				probeCases: [[[0, '1', ['proposalId']]]],
			},
		],
	},
	'/~/waku/connection/[connectionId]/node-state/[nodeId]': {
		routeId: '/~/waku/connection/[connectionId=stringSegment]/node-state/[nodeId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWakuNodeState.ConnectionIdNodeId',
				probeAtomPrefixes: ['/~/waku/connection/[connectionId]/node-state/[nodeId]:BlockheadWakuNodeState.ConnectionIdNodeId'],
				probeCases: [[[0, '1', ['connectionId', 'nodeId']]]],
			},
		],
	},
	'/~/waku/connection/[connectionId]/node-state/[nodeId]/message/[messageHash]/observations/[timestampMs]/[source]': {
		routeId: '/~/waku/connection/[connectionId=stringSegment]/node-state/[nodeId=stringSegment]/(blockheadWakuNodeState)/message/[messageHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWakuMessageObservation_Timestamp.NodeStateMessageHashTimestampMsSource',
				probeAtomPrefixes: ['/~/waku/connection/[connectionId]/node-state/[nodeId]/message/[messageHash]/observations/[timestampMs]/[source]:BlockheadWakuMessageObservation_Timestamp.NodeStateMessageHashTimestampMsSource'],
				probeCases: [[[0, '1', ['messageHash', 'timestampMs', 'source', 'connectionId', 'nodeId']]]],
			},
		],
	},
	'/~/waku/connection/[connectionId]/node-state/[nodeId]/observations/[timestampMs]/[source]': {
		routeId: '/~/waku/connection/[connectionId=stringSegment]/node-state/[nodeId=stringSegment]/(blockheadWakuNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWakuNodeState_Timestamp.NodeStateTimestampMsSource',
				probeAtomPrefixes: ['/~/waku/connection/[connectionId]/node-state/[nodeId]/observations/[timestampMs]/[source]:BlockheadWakuNodeState_Timestamp.NodeStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId', 'nodeId']]]],
			},
		],
	},
	'/~/wallet/[id]': {
		routeId: '/~/wallet/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWallet.Id',
				probeAtomPrefixes: ['/~/wallet/[id]:BlockheadWallet.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/wallet/authentication/[authenticationId]': {
		routeId: '/~/wallet/authentication/[authenticationId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWalletAuthentication.AuthenticationId',
				probeAtomPrefixes: ['/~/wallet/authentication/[authenticationId]:BlockheadWalletAuthentication.AuthenticationId'],
				probeCases: [[[0, '1', ['authenticationId']]]],
			},
		],
	},
	'/~/wallet/capability-grant/[grantId]': {
		routeId: '/~/wallet/capability-grant/[grantId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWalletCapabilityGrant.GrantId',
				probeAtomPrefixes: ['/~/wallet/capability-grant/[grantId]:BlockheadWalletCapabilityGrant.GrantId'],
				probeCases: [[[0, '1', ['grantId']]]],
			},
		],
	},
	'/~/wallet/connection-method/[id]': {
		routeId: '/~/wallet/connection-method/[id=stringSegment]',
		mappings: [
			{
				id: 'WalletConnectionMethod.Id',
				probeAtomPrefixes: ['/~/wallet/connection-method/[id]:WalletConnectionMethod.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/wallet/connection/[connectionKey]/transport-session/[transportSessionId]': {
		routeId: '/~/wallet/connection/[connectionKey=stringSegment]/transport-session/[transportSessionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWalletTransportSession.ConnectionKeyTransportSessionId',
				probeAtomPrefixes: ['/~/wallet/connection/[connectionKey]/transport-session/[transportSessionId]:BlockheadWalletTransportSession.ConnectionKeyTransportSessionId'],
				probeCases: [[[0, '1', ['connectionKey', 'transportSessionId']]]],
			},
		],
	},
	'/~/wallets/connections/[connectionKey]': {
		routeId: '/~/wallets/connections/[connectionKey=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWalletConnection.ConnectionKey',
				probeAtomPrefixes: ['/~/wallets/connections/[connectionKey]:BlockheadWalletConnection.ConnectionKey'],
				probeCases: [[[0, '1', ['connectionKey']]]],
			},
		],
	},
	'/~/wallets/requests/[id]': {
		routeId: '/~/wallets/requests/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWalletRequest.Id',
				probeAtomPrefixes: ['/~/wallets/requests/[id]:BlockheadWalletRequest.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/wallets/requests/[id]/evm-request': {
		routeId: '/~/wallets/requests/[id=stringSegment]/(blockheadWalletRequest)/evm-request',
		mappings: [
			{
				id: 'BlockheadEvmWalletRequest.EvmWalletRequest',
				probeAtomPrefixes: ['/~/wallets/requests/[id]/evm-request:BlockheadEvmWalletRequest.EvmWalletRequest'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/wallets/requests/[id]/evm-request/call/[callIndex]': {
		routeId: '/~/wallets/requests/[id=stringSegment]/(blockheadWalletRequest)/evm-request/(blockheadEvmWalletRequest)/call/[callIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadWalletRequestCall.EvmWalletRequestCallIndex',
				probeAtomPrefixes: ['/~/wallets/requests/[id]/evm-request/call/[callIndex]:BlockheadWalletRequestCall.EvmWalletRequestCallIndex'],
				probeCases: [[[0, '1', ['callIndex', 'id']]]],
			},
		],
	},
	'/~/wallets/requests/[id]/observations/[timestampMs]/[source]': {
		routeId: '/~/wallets/requests/[id=stringSegment]/(blockheadWalletRequest)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWalletRequest_Timestamp.WalletRequestTimestampMsSource',
				probeAtomPrefixes: ['/~/wallets/requests/[id]/observations/[timestampMs]/[source]:BlockheadWalletRequest_Timestamp.WalletRequestTimestampMsSource'],
				probeCases: [[[0, '1', ['source', 'timestampMs', 'id']]]],
			},
		],
	},
	'/~/workspace/[id]': {
		routeId: '/~/workspace/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWorkspace.Id',
				probeAtomPrefixes: ['/~/workspace/[id]:BlockheadWorkspace.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/~/zcash/wallet/[walletId]/note-state/[pool]/[noteCommitment]': {
		routeId: '/~/zcash/wallet/[walletId=stringSegment]/note-state/[pool=stringSegment]/[noteCommitment=stringSegment]',
		mappings: [
			{
				id: 'BlockheadZcashNoteState.WalletIdPoolNoteCommitment',
				probeAtomPrefixes: ['/~/zcash/wallet/[walletId]/note-state/[pool]/[noteCommitment]:BlockheadZcashNoteState.WalletIdPoolNoteCommitment'],
				probeCases: [[[0, '1', ['walletId', 'pool', 'noteCommitment']]]],
			},
		],
	},
	'/~/zcash/wallet/[walletId]/note-state/[pool]/[noteCommitment]/observations/[timestampMs]/[source]': {
		routeId: '/~/zcash/wallet/[walletId=stringSegment]/note-state/[pool=stringSegment]/[noteCommitment=stringSegment]/(blockheadZcashNoteState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadZcashNoteState_Timestamp.NoteStateTimestampMsSource',
				probeAtomPrefixes: ['/~/zcash/wallet/[walletId]/note-state/[pool]/[noteCommitment]/observations/[timestampMs]/[source]:BlockheadZcashNoteState_Timestamp.NoteStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId', 'pool', 'noteCommitment']]]],
			},
		],
	},
	'/~/zcash/wallet/[walletId]/state': {
		routeId: '/~/zcash/wallet/[walletId=stringSegment]/state',
		mappings: [
			{
				id: 'BlockheadZcashWalletState.WalletId',
				probeAtomPrefixes: ['/~/zcash/wallet/[walletId]/state:BlockheadZcashWalletState.WalletId'],
				probeCases: [[[0, '1', ['walletId']]]],
			},
		],
	},
	'/~/zcash/wallet/[walletId]/state/observations/[timestampMs]/[source]': {
		routeId: '/~/zcash/wallet/[walletId=stringSegment]/state/(blockheadZcashWalletState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadZcashWalletState_Timestamp.WalletStateTimestampMsSource',
				probeAtomPrefixes: ['/~/zcash/wallet/[walletId]/state/observations/[timestampMs]/[source]:BlockheadZcashWalletState_Timestamp.WalletStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId']]]],
			},
		],
	},
	'/~/zcash/wallet/[walletId]/viewing-key/[keyFingerprint]': {
		routeId: '/~/zcash/wallet/[walletId=stringSegment]/viewing-key/[keyFingerprint=stringSegment]',
		mappings: [
			{
				id: 'BlockheadZcashViewingKey.WalletIdKeyFingerprint',
				probeAtomPrefixes: ['/~/zcash/wallet/[walletId]/viewing-key/[keyFingerprint]:BlockheadZcashViewingKey.WalletIdKeyFingerprint'],
				probeCases: [[[0, '1', ['walletId', 'keyFingerprint']]]],
			},
		],
	},
	'/~/zcash/wallet/[walletId]/viewing-key/[keyFingerprint]/observations/[timestampMs]/[source]': {
		routeId: '/~/zcash/wallet/[walletId=stringSegment]/viewing-key/[keyFingerprint=stringSegment]/(blockheadZcashViewingKey)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadZcashViewingKey_Timestamp.ViewingKeyTimestampMsSource',
				probeAtomPrefixes: ['/~/zcash/wallet/[walletId]/viewing-key/[keyFingerprint]/observations/[timestampMs]/[source]:BlockheadZcashViewingKey_Timestamp.ViewingKeyTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'walletId', 'keyFingerprint']]]],
			},
		],
	},
	'/bittorrent/torrent/[infoHash]/[hashVersion]': {
		routeId: '/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]',
		mappings: [
			{
				id: 'BitTorrentMetainfo.InfoHashHashVersion',
				probeAtomPrefixes: ['/bittorrent/torrent/[infoHash]/[hashVersion]:BitTorrentMetainfo.InfoHashHashVersion'],
				probeCases: [[[0, '1', ['infoHash', 'hashVersion']]]],
			},
		],
	},
	'/bittorrent/torrent/[infoHash]/[hashVersion]/dht-lookup/[timestampMs]/[source]': {
		routeId: '/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/dht-lookup/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BitTorrentDhtLookup_Timestamp.TorrentTimestampMsSource',
				probeAtomPrefixes: ['/bittorrent/torrent/[infoHash]/[hashVersion]/dht-lookup/[timestampMs]/[source]:BitTorrentDhtLookup_Timestamp.TorrentTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'infoHash', 'hashVersion']]]],
			},
		],
	},
	'/bittorrent/torrent/[infoHash]/[hashVersion]/file/[fileIndex]': {
		routeId: '/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/file/[fileIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BitTorrentFile.TorrentFileIndex',
				probeAtomPrefixes: ['/bittorrent/torrent/[infoHash]/[hashVersion]/file/[fileIndex]:BitTorrentFile.TorrentFileIndex'],
				probeCases: [[[0, '1', ['fileIndex', 'infoHash', 'hashVersion']]]],
			},
		],
	},
	'/bittorrent/torrent/[infoHash]/[hashVersion]/observations/[timestampMs]/[source]': {
		routeId: '/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BitTorrentSwarmObservation_Timestamp.TorrentTimestampMsSource',
				probeAtomPrefixes: ['/bittorrent/torrent/[infoHash]/[hashVersion]/observations/[timestampMs]/[source]:BitTorrentSwarmObservation_Timestamp.TorrentTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'infoHash', 'hashVersion']]]],
			},
		],
	},
	'/bittorrent/torrent/[infoHash]/[hashVersion]/peer/[peerId]/observations/[timestampMs]/[source]': {
		routeId: '/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/peer/[peerId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BitTorrentPeer_Timestamp.TorrentPeerIdTimestampMsSource',
				probeAtomPrefixes: ['/bittorrent/torrent/[infoHash]/[hashVersion]/peer/[peerId]/observations/[timestampMs]/[source]:BitTorrentPeer_Timestamp.TorrentPeerIdTimestampMsSource'],
				probeCases: [[[0, '1', ['peerId', 'timestampMs', 'source', 'infoHash', 'hashVersion']]]],
			},
		],
	},
	'/bittorrent/torrent/[infoHash]/[hashVersion]/piece/[pieceIndex]': {
		routeId: '/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/piece/[pieceIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BitTorrentPiece.TorrentPieceIndex',
				probeAtomPrefixes: ['/bittorrent/torrent/[infoHash]/[hashVersion]/piece/[pieceIndex]:BitTorrentPiece.TorrentPieceIndex'],
				probeCases: [[[0, '1', ['pieceIndex', 'infoHash', 'hashVersion']]]],
			},
		],
	},
	'/bittorrent/torrent/[infoHash]/[hashVersion]/tracker/[trackerUrl]/observations/[timestampMs]/[source]': {
		routeId: '/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/tracker/[trackerUrl=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BitTorrentAnnounce_Timestamp.TorrentTrackerTimestampMsSource',
				probeAtomPrefixes: ['/bittorrent/torrent/[infoHash]/[hashVersion]/tracker/[trackerUrl]/observations/[timestampMs]/[source]:BitTorrentAnnounce_Timestamp.TorrentTrackerTimestampMsSource'],
				probeCases: [[[0, '1', ['trackerUrl', 'timestampMs', 'source', 'infoHash', 'hashVersion']]]],
			},
		],
	},
	'/bittorrent/torrent/[infoHash]/[hashVersion]/tree/[path]': {
		routeId: '/bittorrent/torrent/[infoHash=stringSegment]/[hashVersion=stringSegment]/(bitTorrentMetainfo)/tree/[path=stringSegment]',
		mappings: [
			{
				id: 'BitTorrentFileTreeEntry.TorrentPath',
				probeAtomPrefixes: ['/bittorrent/torrent/[infoHash]/[hashVersion]/tree/[path]:BitTorrentFileTreeEntry.TorrentPath'],
				probeCases: [[[0, '1', ['path', 'infoHash', 'hashVersion']]]],
			},
		],
	},
	'/bittorrent/tracker/[trackerUrl]': {
		routeId: '/bittorrent/tracker/[trackerUrl=stringSegment]',
		mappings: [
			{
				id: 'BitTorrentTracker.TrackerUrl',
				probeAtomPrefixes: ['/bittorrent/tracker/[trackerUrl]:BitTorrentTracker.TrackerUrl'],
				probeCases: [[[0, '1', ['trackerUrl']]]],
			},
		],
	},
	'/bittorrent/tracker/[trackerUrl]/scrape/[infoHash]/[timestampMs]/[source]': {
		routeId: '/bittorrent/tracker/[trackerUrl=stringSegment]/(bitTorrentTracker)/scrape/[infoHash=stringSegment]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BitTorrentTrackerScrape_Timestamp.TrackerInfoHashTimestampMsSource',
				probeAtomPrefixes: ['/bittorrent/tracker/[trackerUrl]/scrape/[infoHash]/[timestampMs]/[source]:BitTorrentTrackerScrape_Timestamp.TrackerInfoHashTimestampMsSource'],
				probeCases: [[[0, '1', ['infoHash', 'timestampMs', 'source', 'trackerUrl']]]],
			},
		],
	},
	'/cashu/mint/[mintUrl]': {
		routeId: '/cashu/mint/[mintUrl=absoluteUrl]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'CashuMint.MintUrl',
				probeAtomPrefixes: ['/cashu/mint/[mintUrl]:CashuMint.MintUrl'],
				probeCases: [[[0, '1', ['mintUrl']]]],
			},
		],
	},
	'/cashu/mint/[mintUrl]/keyset/[keysetId]': {
		routeId: '/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/keyset/[keysetId=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'CashuKeyset.CashuMintKeysetId',
				probeAtomPrefixes: ['/cashu/mint/[mintUrl]/keyset/[keysetId]:CashuKeyset.CashuMintKeysetId'],
				probeCases: [[[0, '1', ['keysetId', 'mintUrl']]]],
			},
		],
	},
	'/cashu/mint/[mintUrl]/keyset/[keysetId]/observations/[timestampMs]/[source]': {
		routeId: '/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/keyset/[keysetId=stringSegment]/(cashuKeyset)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'CashuKeyset_Timestamp.KeysetTimestampMsSource',
				probeAtomPrefixes: ['/cashu/mint/[mintUrl]/keyset/[keysetId]/observations/[timestampMs]/[source]:CashuKeyset_Timestamp.KeysetTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'keysetId', 'mintUrl']]]],
			},
		],
	},
	'/cashu/mint/[mintUrl]/melt-quote/[method]/[quoteId]': {
		routeId: '/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/melt-quote/[method=stringSegment]/[quoteId=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadCashuMeltQuote.MintMethodQuoteId',
				probeAtomPrefixes: ['/cashu/mint/[mintUrl]/melt-quote/[method]/[quoteId]:BlockheadCashuMeltQuote.MintMethodQuoteId'],
				probeCases: [[[0, '1', ['method', 'quoteId', 'mintUrl']]]],
			},
		],
	},
	'/cashu/mint/[mintUrl]/melt-quote/[method]/[quoteId]/observations/[timestampMs]/[source]': {
		routeId: '/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/melt-quote/[method=stringSegment]/[quoteId=stringSegment]/(blockheadCashuMeltQuote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadCashuMeltQuote_Timestamp.MeltQuoteTimestampMsSource',
				probeAtomPrefixes: ['/cashu/mint/[mintUrl]/melt-quote/[method]/[quoteId]/observations/[timestampMs]/[source]:BlockheadCashuMeltQuote_Timestamp.MeltQuoteTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'method', 'quoteId', 'mintUrl']]]],
			},
		],
	},
	'/cashu/mint/[mintUrl]/mint-quote/[method]/[quoteId]': {
		routeId: '/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/mint-quote/[method=stringSegment]/[quoteId=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadCashuMintQuote.MintMethodQuoteId',
				probeAtomPrefixes: ['/cashu/mint/[mintUrl]/mint-quote/[method]/[quoteId]:BlockheadCashuMintQuote.MintMethodQuoteId'],
				probeCases: [[[0, '1', ['method', 'quoteId', 'mintUrl']]]],
			},
		],
	},
	'/cashu/mint/[mintUrl]/mint-quote/[method]/[quoteId]/observations/[timestampMs]/[source]': {
		routeId: '/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/mint-quote/[method=stringSegment]/[quoteId=stringSegment]/(blockheadCashuMintQuote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadCashuMintQuote_Timestamp.MintQuoteTimestampMsSource',
				probeAtomPrefixes: ['/cashu/mint/[mintUrl]/mint-quote/[method]/[quoteId]/observations/[timestampMs]/[source]:BlockheadCashuMintQuote_Timestamp.MintQuoteTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'method', 'quoteId', 'mintUrl']]]],
			},
		],
	},
	'/cashu/mint/[mintUrl]/observations/[timestampMs]/[source]': {
		routeId: '/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			mintUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'CashuMint_Timestamp.MintTimestampMsSource',
				probeAtomPrefixes: ['/cashu/mint/[mintUrl]/observations/[timestampMs]/[source]:CashuMint_Timestamp.MintTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'mintUrl']]]],
			},
		],
	},
	'/cctp/fee/[apiHost]/[fromDomain]/[toDomain]': {
		routeId: '/cctp/fee/[apiHost=stringSegment]/[fromDomain=nonNegativeInteger]/[toDomain=nonNegativeInteger]',
		mappings: [
			{
				id: 'CctpFee.ApiHostFromDomainToDomain',
				probeAtomPrefixes: ['/cctp/fee/[apiHost]/[fromDomain]/[toDomain]:CctpFee.ApiHostFromDomainToDomain'],
				probeCases: [[[0, '1', ['apiHost', 'fromDomain', 'toDomain']]]],
			},
		],
	},
	'/cctp/message/[sourceDomain]/[nonce]': {
		routeId: '/cctp/message/[sourceDomain=nonNegativeInteger]/[nonce=stringSegment]',
		mappings: [
			{
				id: 'CctpMessage.SourceDomainNonce',
				probeAtomPrefixes: ['/cctp/message/[sourceDomain]/[nonce]:CctpMessage.SourceDomainNonce'],
				probeCases: [[[0, '1', ['sourceDomain', 'nonce']]]],
			},
		],
	},
	'/cctp/version/[cctpVersion]/domain/[domainId]': {
		routeId: '/cctp/version/[cctpVersion=nonNegativeInteger]/domain/[domainId=nonNegativeInteger]',
		mappings: [
			{
				id: 'CctpDomainSupport.CctpVersionDomainId',
				probeAtomPrefixes: ['/cctp/version/[cctpVersion]/domain/[domainId]:CctpDomainSupport.CctpVersionDomainId'],
				probeCases: [[[0, '1', ['cctpVersion', 'domainId']]]],
			},
		],
	},
	'/codex/dataset/[cid]': {
		routeId: '/codex/dataset/[cid=stringSegment]',
		mappings: [
			{
				id: 'CodexDataset.Cid',
				probeAtomPrefixes: ['/codex/dataset/[cid]:CodexDataset.Cid'],
				probeCases: [[[0, '1', ['cid']]]],
			},
		],
	},
	'/contract-interface/[interfaceId]/member/[memberKey]': {
		routeId: '/contract-interface/[interfaceId=stringSegment]/member/[memberKey=stringSegment]',
		mappings: [
			{
				id: 'ContractInterfaceMember.InterfaceIdMemberKey',
				probeAtomPrefixes: ['/contract-interface/[interfaceId]/member/[memberKey]:ContractInterfaceMember.InterfaceIdMemberKey'],
				probeCases: [[[0, '1', ['interfaceId', 'memberKey']]]],
			},
		],
	},
	'/evm/account/[address]/interop/[interopAddress]': {
		routeId: '/evm/account/[address=evmAddress]/interop/[interopAddress=stringSegment]',
		mappings: [
			{
				id: 'EvmAccount.AddressInteropAddress',
				probeAtomPrefixes: ['/evm/account/[address]/interop/[interopAddress]:EvmAccount.AddressInteropAddress'],
				probeCases: [[[0, '1', ['address', 'interopAddress']]]],
			},
		],
	},
	'/farcaster/cast/[hash]': {
		routeId: '/farcaster/cast/[hash=zeroExHex]',
		mappings: [
			{
				id: 'FarcasterCast.Hash',
				probeAtomPrefixes: ['/farcaster/cast/[hash]:FarcasterCast.Hash'],
				probeCases: [[[0, '1', ['hash']]]],
			},
		],
	},
	'/farcaster/cast/client/[clientUrl]': {
		routeId: '/farcaster/cast/client/[clientUrl=stringSegment]',
		mappings: [
			{
				id: 'FarcasterCast.ClientUrl',
				probeAtomPrefixes: ['/farcaster/cast/client/[clientUrl]:FarcasterCast.ClientUrl'],
				probeCases: [[[0, '1', ['clientUrl']]]],
			},
		],
	},
	'/farcaster/channel/parent/[parentUrl]': {
		routeId: '/farcaster/channel/parent/[parentUrl=stringSegment]',
		mappings: [
			{
				id: 'FarcasterChannel.ParentUrl',
				probeAtomPrefixes: ['/farcaster/channel/parent/[parentUrl]:FarcasterChannel.ParentUrl'],
				probeCases: [[[0, '1', ['parentUrl']]]],
			},
		],
	},
	'/fedimint/federation/[federationId]': {
		routeId: '/fedimint/federation/[federationId=stringSegment]',
		mappings: [
			{
				id: 'FedimintFederation.FederationId',
				probeAtomPrefixes: ['/fedimint/federation/[federationId]:FedimintFederation.FederationId'],
				probeCases: [[[0, '1', ['federationId']]]],
			},
		],
	},
	'/fedimint/federation/[federationId]/observations/[timestampMs]/[source]': {
		routeId: '/fedimint/federation/[federationId=stringSegment]/(fedimintFederation)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'FedimintFederation_Timestamp.FederationTimestampMsSource',
				probeAtomPrefixes: ['/fedimint/federation/[federationId]/observations/[timestampMs]/[source]:FedimintFederation_Timestamp.FederationTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'federationId']]]],
			},
		],
	},
	'/fedimint/gateway/[gatewayId]': {
		routeId: '/fedimint/gateway/[gatewayId=stringSegment]',
		mappings: [
			{
				id: 'FedimintGateway.GatewayId',
				probeAtomPrefixes: ['/fedimint/gateway/[gatewayId]:FedimintGateway.GatewayId'],
				probeCases: [[[0, '1', ['gatewayId']]]],
			},
		],
	},
	'/fedimint/gateway/[gatewayId]/observations/[timestampMs]/[source]': {
		routeId: '/fedimint/gateway/[gatewayId=stringSegment]/(fedimintGateway)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'FedimintGateway_Timestamp.GatewayTimestampMsSource',
				probeAtomPrefixes: ['/fedimint/gateway/[gatewayId]/observations/[timestampMs]/[source]:FedimintGateway_Timestamp.GatewayTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'gatewayId']]]],
			},
		],
	},
	'/git/blob/[objectId]/[objectFormat]': {
		routeId: '/git/blob/[objectId=zeroExHex]/[objectFormat=stringSegment]',
		mappings: [
			{
				id: 'GitBlob.ObjectIdObjectFormat',
				probeAtomPrefixes: ['/git/blob/[objectId]/[objectFormat]:GitBlob.ObjectIdObjectFormat'],
				probeCases: [[[0, '1', ['objectId', 'objectFormat']]]],
			},
		],
	},
	'/git/commit/[objectId]/[objectFormat]': {
		routeId: '/git/commit/[objectId=zeroExHex]/[objectFormat=stringSegment]',
		mappings: [
			{
				id: 'GitCommit.ObjectIdObjectFormat',
				probeAtomPrefixes: ['/git/commit/[objectId]/[objectFormat]:GitCommit.ObjectIdObjectFormat'],
				probeCases: [[[0, '1', ['objectId', 'objectFormat']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]',
		mappings: [
			{
				id: 'GitForgeMirror.ForgeHostOwnerRepositoryName',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]:GitForgeMirror.ForgeHostOwnerRepositoryName'],
				probeCases: [[[0, '1', ['forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/compare/[fromObjectId]/[toObjectId]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/compare/[fromObjectId=zeroExHex]/[toObjectId=zeroExHex]',
		mappings: [
			{
				id: 'GitForgeCompare.ForgeMirrorFromObjectIdToObjectId',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/compare/[fromObjectId]/[toObjectId]:GitForgeCompare.ForgeMirrorFromObjectIdToObjectId'],
				probeCases: [[[0, '1', ['fromObjectId', 'toObjectId', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/compare/[fromObjectId]/[toObjectId]/file/[oldPath]/[newPath]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/compare/[fromObjectId=zeroExHex]/[toObjectId=zeroExHex]/(gitForgeCompare)/file/[oldPath=stringSegment]/[newPath=stringSegment]',
		parameterEncodingByName: {
			oldPath: 'Opaque',
			newPath: 'Opaque',
		},
		mappings: [
			{
				id: 'GitForgeCompareFileChange.CompareOldPathNewPath',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/compare/[fromObjectId]/[toObjectId]/file/[oldPath]/[newPath]:GitForgeCompareFileChange.CompareOldPathNewPath'],
				probeCases: [[[0, '1', ['oldPath', 'newPath', 'fromObjectId', 'toObjectId', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/issue/[issueNumber]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/issue/[issueNumber=nonNegativeInteger]',
		mappings: [
			{
				id: 'GitForgeIssue.ForgeMirrorIssueNumber',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/issue/[issueNumber]:GitForgeIssue.ForgeMirrorIssueNumber'],
				probeCases: [[[0, '1', ['issueNumber', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/issue/[issueNumber]/note/[noteId]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/issue/[issueNumber=nonNegativeInteger]/(gitForgeIssue)/note/[noteId=nonNegativeInteger]',
		mappings: [
			{
				id: 'GitForgeIssueNote.IssueNoteId',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/issue/[issueNumber]/note/[noteId]:GitForgeIssueNote.IssueNoteId'],
				probeCases: [[[0, '1', ['noteId', 'issueNumber', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/pipeline/[pipelineId]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pipeline/[pipelineId=nonNegativeInteger]',
		mappings: [
			{
				id: 'GitForgePipeline.ForgeMirrorPipelineId',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/pipeline/[pipelineId]:GitForgePipeline.ForgeMirrorPipelineId'],
				probeCases: [[[0, '1', ['pipelineId', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/pipeline/[pipelineId]/job/[jobId]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pipeline/[pipelineId=nonNegativeInteger]/(gitForgePipeline)/job/[jobId=nonNegativeInteger]',
		mappings: [
			{
				id: 'GitForgeJob.PipelineJobId',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/pipeline/[pipelineId]/job/[jobId]:GitForgeJob.PipelineJobId'],
				probeCases: [[[0, '1', ['jobId', 'pipelineId', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/protected-branch/[name]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/protected-branch/[name=stringSegment]',
		mappings: [
			{
				id: 'GitForgeProtectedBranch.ForgeMirrorName',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/protected-branch/[name]:GitForgeProtectedBranch.ForgeMirrorName'],
				probeCases: [[[0, '1', ['name', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/pull-request/[pullRequestNumber]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pull-request/[pullRequestNumber=nonNegativeInteger]',
		mappings: [
			{
				id: 'GitForgePullRequest.ForgeMirrorPullRequestNumber',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/pull-request/[pullRequestNumber]:GitForgePullRequest.ForgeMirrorPullRequestNumber'],
				probeCases: [[[0, '1', ['pullRequestNumber', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/pull-request/[pullRequestNumber]/note/[noteId]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pull-request/[pullRequestNumber=nonNegativeInteger]/(gitForgePullRequest)/note/[noteId=nonNegativeInteger]',
		mappings: [
			{
				id: 'GitForgePullRequestNote.PullRequestNoteId',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/pull-request/[pullRequestNumber]/note/[noteId]:GitForgePullRequestNote.PullRequestNoteId'],
				probeCases: [[[0, '1', ['noteId', 'pullRequestNumber', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/release/[releaseTagName]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/release/[releaseTagName=stringSegment]',
		mappings: [
			{
				id: 'GitForgeRelease.ForgeMirrorReleaseTagName',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/release/[releaseTagName]:GitForgeRelease.ForgeMirrorReleaseTagName'],
				probeCases: [[[0, '1', ['releaseTagName', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/forge/[forgeHost]/[owner]/[repositoryName]/release/[releaseTagName]/asset/[linkId]': {
		routeId: '/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/release/[releaseTagName=stringSegment]/(gitForgeRelease)/asset/[linkId=nonNegativeInteger]',
		mappings: [
			{
				id: 'GitForgeReleaseLink.ReleaseLinkId',
				probeAtomPrefixes: ['/git/forge/[forgeHost]/[owner]/[repositoryName]/release/[releaseTagName]/asset/[linkId]:GitForgeReleaseLink.ReleaseLinkId'],
				probeCases: [[[0, '1', ['linkId', 'releaseTagName', 'forgeHost', 'owner', 'repositoryName']]]],
			},
		],
	},
	'/git/object/[objectId]/[objectFormat]': {
		routeId: '/git/object/[objectId=zeroExHex]/[objectFormat=stringSegment]',
		mappings: [
			{
				id: 'GitObject.ObjectIdObjectFormat',
				probeAtomPrefixes: ['/git/object/[objectId]/[objectFormat]:GitObject.ObjectIdObjectFormat'],
				probeCases: [[[0, '1', ['objectId', 'objectFormat']]]],
			},
		],
	},
	'/git/object/[objectId]/[objectFormat]/byte-source/[byteSource]/observations/[timestampMs]/[source]': {
		routeId: '/git/object/[objectId=zeroExHex]/[objectFormat=stringSegment]/(gitObject)/byte-source/[byteSource=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'GitObjectVerification_Timestamp.ObjectIdObjectFormatByteSourceTimestampMsSource',
				probeAtomPrefixes: ['/git/object/[objectId]/[objectFormat]/byte-source/[byteSource]/observations/[timestampMs]/[source]:GitObjectVerification_Timestamp.ObjectIdObjectFormatByteSourceTimestampMsSource'],
				probeCases: [[[0, '1', ['objectId', 'objectFormat', 'byteSource', 'timestampMs', 'source']]]],
			},
		],
	},
	'/git/object/[objectId]/[objectFormat]/loose/[byteSource]': {
		routeId: '/git/object/[objectId=zeroExHex]/[objectFormat=stringSegment]/(gitObject)/loose/[byteSource=stringSegment]',
		mappings: [
			{
				id: 'GitLooseObject.ObjectIdObjectFormatByteSource',
				probeAtomPrefixes: ['/git/object/[objectId]/[objectFormat]/loose/[byteSource]:GitLooseObject.ObjectIdObjectFormatByteSource'],
				probeCases: [[[0, '1', ['objectId', 'objectFormat', 'byteSource']]]],
			},
		],
	},
	'/git/pack/[packHash]': {
		routeId: '/git/pack/[packHash=zeroExHex]',
		mappings: [
			{
				id: 'GitPackfile.PackHash',
				probeAtomPrefixes: ['/git/pack/[packHash]:GitPackfile.PackHash'],
				probeCases: [[[0, '1', ['packHash']]]],
			},
		],
	},
	'/git/pack/[packHash]/object/[objectId]/[objectFormat]': {
		routeId: '/git/pack/[packHash=zeroExHex]/(gitPackfile)/object/[objectId=zeroExHex]/[objectFormat=stringSegment]',
		mappings: [
			{
				id: 'GitPackedObject.PackHashObjectIdObjectFormat',
				probeAtomPrefixes: ['/git/pack/[packHash]/object/[objectId]/[objectFormat]:GitPackedObject.PackHashObjectIdObjectFormat'],
				probeCases: [[[0, '1', ['packHash', 'objectId', 'objectFormat']]]],
			},
		],
	},
	'/git/repository/id/[repositoryId]': {
		routeId: '/git/repository/id/[repositoryId=stringSegment]',
		mappings: [
			{
				id: 'GitRepository.RepositoryId',
				probeAtomPrefixes: ['/git/repository/id/[repositoryId]:GitRepository.RepositoryId'],
				probeCases: [[[0, '1', ['repositoryId']]]],
			},
		],
	},
	'/git/repository/id/[repositoryId]/ref-update/[refName]/[oldObjectId]/[newObjectId]': {
		routeId: '/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/ref-update/[refName=stringSegment]/[oldObjectId=zeroExHex]/[newObjectId=zeroExHex]',
		mappings: [
			{
				id: 'GitRefUpdate.RepositoryRefNameOldObjectIdNewObjectId',
				probeAtomPrefixes: ['/git/repository/id/[repositoryId]/ref-update/[refName]/[oldObjectId]/[newObjectId]:GitRefUpdate.RepositoryRefNameOldObjectIdNewObjectId'],
				probeCases: [[[0, '1', ['refName', 'oldObjectId', 'newObjectId', 'repositoryId']]]],
			},
		],
	},
	'/git/repository/id/[repositoryId]/ref/[refName]': {
		routeId: '/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/ref/[refName=stringSegment]',
		mappings: [
			{
				id: 'GitRef.RepositoryRefName',
				probeAtomPrefixes: ['/git/repository/id/[repositoryId]/ref/[refName]:GitRef.RepositoryRefName'],
				probeCases: [[[0, '1', ['refName', 'repositoryId']]]],
			},
		],
	},
	'/git/repository/id/[repositoryId]/ref/[refName]/observations/[timestampMs]/[source]': {
		routeId: '/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/ref/[refName=stringSegment]/(gitRef)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'GitRefObservation_Timestamp.RefTimestampMsSource',
				probeAtomPrefixes: ['/git/repository/id/[repositoryId]/ref/[refName]/observations/[timestampMs]/[source]:GitRefObservation_Timestamp.RefTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'refName', 'repositoryId']]]],
			},
		],
	},
	'/git/repository/id/[repositoryId]/remote/[remoteName]': {
		routeId: '/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/remote/[remoteName=stringSegment]',
		mappings: [
			{
				id: 'GitRemote.RepositoryRemoteName',
				probeAtomPrefixes: ['/git/repository/id/[repositoryId]/remote/[remoteName]:GitRemote.RepositoryRemoteName'],
				probeCases: [[[0, '1', ['remoteName', 'repositoryId']]]],
			},
		],
	},
	'/git/repository/id/[repositoryId]/remote/[remoteName]/observations/[timestampMs]/[source]': {
		routeId: '/git/repository/id/[repositoryId=stringSegment]/(gitRepository)/remote/[remoteName=stringSegment]/(gitRemote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'GitFetchObservation.RepositoryRemoteNameTimestampSource',
				probeAtomPrefixes: ['/git/repository/id/[repositoryId]/remote/[remoteName]/observations/[timestampMs]/[source]:GitFetchObservation.RepositoryRemoteNameTimestampSource'],
				probeCases: [[[0, '1', ['remoteName', 'timestampMs', 'source', 'repositoryId']]]],
			},
		],
	},
	'/git/repository/remote/[canonicalRemoteUrl]': {
		routeId: '/git/repository/remote/[canonicalRemoteUrl=absoluteUrl]',
		parameterEncodingByName: {
			canonicalRemoteUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'GitRepository.CanonicalRemoteUrl',
				probeAtomPrefixes: ['/git/repository/remote/[canonicalRemoteUrl]:GitRepository.CanonicalRemoteUrl'],
				probeCases: [[[0, '1', ['canonicalRemoteUrl']]]],
			},
		],
	},
	'/git/repository/remote/[canonicalRemoteUrl]/commit/[commitObjectId]/path/[path]': {
		routeId: '/git/repository/remote/[canonicalRemoteUrl=absoluteUrl]/(gitRepository)/commit/[commitObjectId=zeroExHex]/path/[path=stringSegment]',
		parameterEncodingByName: {
			canonicalRemoteUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'GitTreePathResolution.RepositoryCommitObjectIdPath',
				probeAtomPrefixes: ['/git/repository/remote/[canonicalRemoteUrl]/commit/[commitObjectId]/path/[path]:GitTreePathResolution.RepositoryCommitObjectIdPath'],
				probeCases: [[[0, '1', ['commitObjectId', 'path', 'canonicalRemoteUrl']]]],
			},
		],
	},
	'/git/signature/[signatureId]': {
		routeId: '/git/signature/[signatureId=stringSegment]',
		mappings: [
			{
				id: 'GitSignature.SignatureId',
				probeAtomPrefixes: ['/git/signature/[signatureId]:GitSignature.SignatureId'],
				probeCases: [[[0, '1', ['signatureId']]]],
			},
		],
	},
	'/git/tag/[objectId]/[objectFormat]': {
		routeId: '/git/tag/[objectId=zeroExHex]/[objectFormat=stringSegment]',
		mappings: [
			{
				id: 'GitTag.ObjectIdObjectFormat',
				probeAtomPrefixes: ['/git/tag/[objectId]/[objectFormat]:GitTag.ObjectIdObjectFormat'],
				probeCases: [[[0, '1', ['objectId', 'objectFormat']]]],
			},
		],
	},
	'/git/tree/[objectId]/[objectFormat]': {
		routeId: '/git/tree/[objectId=zeroExHex]/[objectFormat=stringSegment]',
		mappings: [
			{
				id: 'GitTree.ObjectIdObjectFormat',
				probeAtomPrefixes: ['/git/tree/[objectId]/[objectFormat]:GitTree.ObjectIdObjectFormat'],
				probeCases: [[[0, '1', ['objectId', 'objectFormat']]]],
			},
		],
	},
	'/git/tree/[objectId]/[objectFormat]/entry/[path]': {
		routeId: '/git/tree/[objectId=zeroExHex]/[objectFormat=stringSegment]/(gitTree)/entry/[path=stringSegment]',
		mappings: [
			{
				id: 'GitTreeEntry.TreePath',
				probeAtomPrefixes: ['/git/tree/[objectId]/[objectFormat]/entry/[path]:GitTreeEntry.TreePath'],
				probeCases: [[[0, '1', ['path', 'objectId', 'objectFormat']]]],
			},
		],
	},
	'/issuer/action/[issuerActionId]': {
		routeId: '/issuer/action/[issuerActionId=stringSegment]',
		mappings: [
			{
				id: 'IssuerAction.IssuerActionId',
				probeAtomPrefixes: ['/issuer/action/[issuerActionId]:IssuerAction.IssuerActionId'],
				probeCases: [[[0, '1', ['issuerActionId']]]],
			},
		],
	},
	'/lens/account/legacy/[legacyProfileId]': {
		routeId: '/lens/account/legacy/[legacyProfileId=stringSegment]',
		mappings: [
			{
				id: 'LensAccount.LegacyProfileId',
				probeAtomPrefixes: ['/lens/account/legacy/[legacyProfileId]:LensAccount.LegacyProfileId'],
				probeCases: [[[0, '1', ['legacyProfileId']]]],
			},
		],
	},
	'/lens/account/name/[localName]': {
		routeId: '/lens/account/name/[localName=stringSegment]',
		mappings: [
			{
				id: 'LensAccount.LocalName',
				probeAtomPrefixes: ['/lens/account/name/[localName]:LensAccount.LocalName'],
				probeCases: [[[0, '1', ['localName']]]],
			},
		],
	},
	'/lens/username/[namespace]/[localName]': {
		routeId: '/lens/username/[namespace=evmAddress]/[localName=stringSegment]',
		mappings: [
			{
				id: 'LensUsername.NamespaceLocalName',
				probeAtomPrefixes: ['/lens/username/[namespace]/[localName]:LensUsername.NamespaceLocalName'],
				probeCases: [[[0, '1', ['namespace', 'localName']]]],
			},
		],
	},
	'/lens/username/id/[id]': {
		routeId: '/lens/username/id/[id=stringSegment]',
		mappings: [
			{
				id: 'LensUsername.Id',
				probeAtomPrefixes: ['/lens/username/id/[id]:LensUsername.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/magnet/[magnetUri]': {
		routeId: '/magnet/[magnetUri=stringSegment]',
		mappings: [
			{
				id: 'MagnetLink.MagnetUri',
				probeAtomPrefixes: ['/magnet/[magnetUri]:MagnetLink.MagnetUri'],
				probeCases: [[[0, '1', ['magnetUri']]]],
			},
		],
	},
	'/magnet/[magnetUri]/observations/[timestampMs]/[source]': {
		routeId: '/magnet/[magnetUri=stringSegment]/(magnetLink)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'MagnetResolution_Timestamp.MagnetUriTimestampMsSource',
				probeAtomPrefixes: ['/magnet/[magnetUri]/observations/[timestampMs]/[source]:MagnetResolution_Timestamp.MagnetUriTimestampMsSource'],
				probeCases: [[[0, '1', ['magnetUri', 'timestampMs', 'source']]]],
			},
		],
	},
	'/mcp/package/registry/[registryServerName]': {
		routeId: '/mcp/package/registry/[registryServerName=stringSegment]',
		parameterEncodingByName: {
			registryServerName: 'Opaque',
		},
		mappings: [
			{
				id: 'McpServerPackage.RegistryServerName',
				probeAtomPrefixes: ['/mcp/package/registry/[registryServerName]:McpServerPackage.RegistryServerName'],
				probeCases: [[[0, '1', ['registryServerName']]]],
			},
		],
	},
	'/mcp/package/registry/[registryServerName]/version/[version]': {
		routeId: '/mcp/package/registry/[registryServerName=stringSegment]/(mcpServerPackage)/version/[version=stringSegment]',
		parameterEncodingByName: {
			registryServerName: 'Opaque',
		},
		mappings: [
			{
				id: 'McpServerPackageVersion.PackageVersion',
				probeAtomPrefixes: ['/mcp/package/registry/[registryServerName]/version/[version]:McpServerPackageVersion.PackageVersion'],
				probeCases: [[[0, '1', ['version', 'registryServerName']]]],
			},
		],
	},
	'/mcp/package/repository/[repositoryUrl]': {
		routeId: '/mcp/package/repository/[repositoryUrl=absoluteUrl]',
		parameterEncodingByName: {
			repositoryUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'McpServerPackage.RepositoryUrl',
				probeAtomPrefixes: ['/mcp/package/repository/[repositoryUrl]:McpServerPackage.RepositoryUrl'],
				probeCases: [[[0, '1', ['repositoryUrl']]]],
			},
		],
	},
	'/mcp/server/[serverKey]': {
		routeId: '/mcp/server/[serverKey=stringSegment]',
		mappings: [
			{
				id: 'McpServer.ServerKey',
				probeAtomPrefixes: ['/mcp/server/[serverKey]:McpServer.ServerKey'],
				probeCases: [[[0, '1', ['serverKey']]]],
			},
		],
	},
	'/mcp/server/[serverKey]/observations/[timestampMs]/[source]': {
		routeId: '/mcp/server/[serverKey=stringSegment]/(mcpServer)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'McpServer_Timestamp.ServerTimestampMsSource',
				probeAtomPrefixes: ['/mcp/server/[serverKey]/observations/[timestampMs]/[source]:McpServer_Timestamp.ServerTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'serverKey']]]],
			},
		],
	},
	'/mcp/server/[serverKey]/prompt/[name]': {
		routeId: '/mcp/server/[serverKey=stringSegment]/(mcpServer)/prompt/[name=stringSegment]',
		mappings: [
			{
				id: 'McpPrompt.ServerName',
				probeAtomPrefixes: ['/mcp/server/[serverKey]/prompt/[name]:McpPrompt.ServerName'],
				probeCases: [[[0, '1', ['name', 'serverKey']]]],
			},
		],
	},
	'/mcp/server/[serverKey]/prompt/[name]/result/[argumentsHashAlgorithm]/[argumentsHash]/observations/[timestampMs]/[source]': {
		routeId: '/mcp/server/[serverKey=stringSegment]/(mcpServer)/prompt/[name=stringSegment]/(mcpPrompt)/result/[argumentsHashAlgorithm=stringSegment]/[argumentsHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'McpPromptResult.PromptArgumentsHashAlgorithmArgumentsHashTimestampMsSource',
				probeAtomPrefixes: ['/mcp/server/[serverKey]/prompt/[name]/result/[argumentsHashAlgorithm]/[argumentsHash]/observations/[timestampMs]/[source]:McpPromptResult.PromptArgumentsHashAlgorithmArgumentsHashTimestampMsSource'],
				probeCases: [[[0, '1', ['argumentsHashAlgorithm', 'argumentsHash', 'timestampMs', 'source', 'name', 'serverKey']]]],
			},
		],
	},
	'/mcp/server/[serverKey]/resource-template/[uriTemplate]': {
		routeId: '/mcp/server/[serverKey=stringSegment]/(mcpServer)/resource-template/[uriTemplate=stringSegment]',
		mappings: [
			{
				id: 'McpResourceTemplate.ServerUriTemplate',
				probeAtomPrefixes: ['/mcp/server/[serverKey]/resource-template/[uriTemplate]:McpResourceTemplate.ServerUriTemplate'],
				probeCases: [[[0, '1', ['uriTemplate', 'serverKey']]]],
			},
		],
	},
	'/mcp/server/[serverKey]/resource/[uri]': {
		routeId: '/mcp/server/[serverKey=stringSegment]/(mcpServer)/resource/[uri=absoluteUrl]',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'McpResource.ServerUri',
				probeAtomPrefixes: ['/mcp/server/[serverKey]/resource/[uri]:McpResource.ServerUri'],
				probeCases: [[[0, '1', ['uri', 'serverKey']]]],
			},
		],
	},
	'/mcp/server/[serverKey]/resource/[uri]/observations/[timestampMs]/[source]': {
		routeId: '/mcp/server/[serverKey=stringSegment]/(mcpServer)/resource/[uri=absoluteUrl]/(mcpResource)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'McpResourceContent_Timestamp.ResourceTimestampMsSource',
				probeAtomPrefixes: ['/mcp/server/[serverKey]/resource/[uri]/observations/[timestampMs]/[source]:McpResourceContent_Timestamp.ResourceTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'uri', 'serverKey']]]],
			},
		],
	},
	'/mcp/server/[serverKey]/tool-call/[callId]': {
		routeId: '/mcp/server/[serverKey=stringSegment]/(mcpServer)/tool-call/[callId=stringSegment]',
		mappings: [
			{
				id: 'McpToolCall.ServerCallId',
				probeAtomPrefixes: ['/mcp/server/[serverKey]/tool-call/[callId]:McpToolCall.ServerCallId'],
				probeCases: [[[0, '1', ['callId', 'serverKey']]]],
			},
		],
	},
	'/mcp/server/[serverKey]/tool-call/[callId]/observations/[timestampMs]/[source]': {
		routeId: '/mcp/server/[serverKey=stringSegment]/(mcpServer)/tool-call/[callId=stringSegment]/(mcpToolCall)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'McpToolCall_Timestamp.ToolCallTimestampMsSource',
				probeAtomPrefixes: ['/mcp/server/[serverKey]/tool-call/[callId]/observations/[timestampMs]/[source]:McpToolCall_Timestamp.ToolCallTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'callId', 'serverKey']]]],
			},
		],
	},
	'/mcp/server/[serverKey]/tool/[name]': {
		routeId: '/mcp/server/[serverKey=stringSegment]/(mcpServer)/tool/[name=stringSegment]',
		mappings: [
			{
				id: 'McpTool.ServerName',
				probeAtomPrefixes: ['/mcp/server/[serverKey]/tool/[name]:McpTool.ServerName'],
				probeCases: [[[0, '1', ['name', 'serverKey']]]],
			},
		],
	},
	'/near/[slug]': {
		routeId: '/near/[slug=networkSlug]',
		mappings: [
			{
				id: 'NearNetwork.Slug',
				probeAtomPrefixes: ['/near/[slug]:NearNetwork.Slug'],
				probeCases: [[[0, '1', ['slug']]]],
			},
		],
	},
	'/near/[slug]/observations/[timestampMs]/[source]': {
		routeId: '/near/[slug=networkSlug]/(nearNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'NearNetwork_Timestamp.NetworkTimestampMsSource',
				probeAtomPrefixes: ['/near/[slug]/observations/[timestampMs]/[source]:NearNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'slug']]]],
			},
		],
	},
	'/payjoin/directory/[directoryUrl]': {
		routeId: '/payjoin/directory/[directoryUrl=absoluteUrl]',
		parameterEncodingByName: {
			directoryUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'PayjoinDirectory.DirectoryUrl',
				probeAtomPrefixes: ['/payjoin/directory/[directoryUrl]:PayjoinDirectory.DirectoryUrl'],
				probeCases: [[[0, '1', ['directoryUrl']]]],
			},
		],
	},
	'/payjoin/endpoint/[endpointUrl]': {
		routeId: '/payjoin/endpoint/[endpointUrl=stringSegment]',
		mappings: [
			{
				id: 'PayjoinEndpoint.EndpointUrl',
				probeAtomPrefixes: ['/payjoin/endpoint/[endpointUrl]:PayjoinEndpoint.EndpointUrl'],
				probeCases: [[[0, '1', ['endpointUrl']]]],
			},
		],
	},
	'/payjoin/endpoint/[endpointUrl]/observations/[timestampMs]/[source]': {
		routeId: '/payjoin/endpoint/[endpointUrl=stringSegment]/(payjoinEndpoint)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'PayjoinEndpoint_Timestamp.EndpointTimestampMsSource',
				probeAtomPrefixes: ['/payjoin/endpoint/[endpointUrl]/observations/[timestampMs]/[source]:PayjoinEndpoint_Timestamp.EndpointTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'endpointUrl']]]],
			},
		],
	},
	'/payout/[payoutSource]/[payoutId]': {
		routeId: '/payout/[payoutSource=stringSegment]/[payoutId=stringSegment]',
		mappings: [
			{
				id: 'Payout.SourcePayoutId',
				probeAtomPrefixes: ['/payout/[payoutSource]/[payoutId]:Payout.SourcePayoutId'],
				probeCases: [[[0, '1', ['payoutSource', 'payoutId']]]],
			},
		],
	},
	'/payout/[payoutSource]/[payoutId]/claim/[namespace]:[reference]/[accountAddress]/observations/[timestampMs]/[source]': {
		routeId: '/payout/[payoutSource=stringSegment]/[payoutId=stringSegment]/(payout)/claim/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'PayoutClaim_Timestamp.PayoutAccountTimestampMsSource',
				probeAtomPrefixes: ['/payout/[payoutSource]/[payoutId]/claim/[namespace]:[reference]/[accountAddress]/observations/[timestampMs]/[source]:PayoutClaim_Timestamp.PayoutAccountTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'namespace', 'reference', 'accountAddress', 'payoutSource', 'payoutId']]]],
			},
		],
	},
	'/radicle/identity/[rid]/revision/[revision]': {
		routeId: '/radicle/identity/[rid=stringSegment]/revision/[revision=stringSegment]',
		mappings: [
			{
				id: 'RadicleIdentityDocument.RidRevision',
				probeAtomPrefixes: ['/radicle/identity/[rid]/revision/[revision]:RadicleIdentityDocument.RidRevision'],
				probeCases: [[[0, '1', ['rid', 'revision']]]],
			},
		],
	},
	'/radicle/identity/[rid]/revision/[revision]/document': {
		routeId: '/radicle/identity/[rid=stringSegment]/revision/[revision=stringSegment]/(radicleIdentityDocument)/document',
		mappings: [
			{
				id: 'RadicleIdentityRevision.RidRevision',
				probeAtomPrefixes: ['/radicle/identity/[rid]/revision/[revision]/document:RadicleIdentityRevision.RidRevision'],
				probeCases: [[[0, '1', ['rid', 'revision']]]],
			},
		],
	},
	'/radicle/repository/[rid]': {
		routeId: '/radicle/repository/[rid=stringSegment]',
		mappings: [
			{
				id: 'RadicleRepository.Rid',
				probeAtomPrefixes: ['/radicle/repository/[rid]:RadicleRepository.Rid'],
				probeCases: [[[0, '1', ['rid']]]],
			},
		],
	},
	'/radicle/repository/[rid]/delegate/[did]': {
		routeId: '/radicle/repository/[rid=stringSegment]/(radicleRepository)/delegate/[did=stringSegment]',
		mappings: [
			{
				id: 'RadicleDelegate.RepositoryDid',
				probeAtomPrefixes: ['/radicle/repository/[rid]/delegate/[did]:RadicleDelegate.RepositoryDid'],
				probeCases: [[[0, '1', ['did', 'rid']]]],
			},
		],
	},
	'/radicle/repository/[rid]/event/[eventId]': {
		routeId: '/radicle/repository/[rid=stringSegment]/(radicleRepository)/event/[eventId=stringSegment]',
		mappings: [
			{
				id: 'RadicleCollaborationEvent.RepositoryEventId',
				probeAtomPrefixes: ['/radicle/repository/[rid]/event/[eventId]:RadicleCollaborationEvent.RepositoryEventId'],
				probeCases: [[[0, '1', ['eventId', 'rid']]]],
			},
		],
	},
	'/radicle/repository/[rid]/issue/[issueId]': {
		routeId: '/radicle/repository/[rid=stringSegment]/(radicleRepository)/issue/[issueId=stringSegment]',
		mappings: [
			{
				id: 'RadicleIssue.RepositoryIssueId',
				probeAtomPrefixes: ['/radicle/repository/[rid]/issue/[issueId]:RadicleIssue.RepositoryIssueId'],
				probeCases: [[[0, '1', ['issueId', 'rid']]]],
			},
		],
	},
	'/radicle/repository/[rid]/patch/[patchId]': {
		routeId: '/radicle/repository/[rid=stringSegment]/(radicleRepository)/patch/[patchId=stringSegment]',
		mappings: [
			{
				id: 'RadiclePatch.RepositoryPatchId',
				probeAtomPrefixes: ['/radicle/repository/[rid]/patch/[patchId]:RadiclePatch.RepositoryPatchId'],
				probeCases: [[[0, '1', ['patchId', 'rid']]]],
			},
		],
	},
	'/radicle/repository/[rid]/seed/[nodeId]/observations/[timestampMs]/[source]': {
		routeId: '/radicle/repository/[rid=stringSegment]/(radicleRepository)/seed/[nodeId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadRadicleSeedObservation_Timestamp.RepositoryNodeIdTimestampMsSource',
				probeAtomPrefixes: ['/radicle/repository/[rid]/seed/[nodeId]/observations/[timestampMs]/[source]:BlockheadRadicleSeedObservation_Timestamp.RepositoryNodeIdTimestampMsSource'],
				probeCases: [[[0, '1', ['nodeId', 'timestampMs', 'source', 'rid']]]],
			},
		],
	},
	'/radicle/repository/[rid]/signed-ref/[nodeId]/[refName]': {
		routeId: '/radicle/repository/[rid=stringSegment]/(radicleRepository)/signed-ref/[nodeId=stringSegment]/[refName=stringSegment]',
		mappings: [
			{
				id: 'RadicleSignedRef.RepositoryNodeIdRefName',
				probeAtomPrefixes: ['/radicle/repository/[rid]/signed-ref/[nodeId]/[refName]:RadicleSignedRef.RepositoryNodeIdRefName'],
				probeCases: [[[0, '1', ['nodeId', 'refName', 'rid']]]],
			},
		],
	},
	'/radicle/repository/[rid]/signed-ref/[nodeId]/[refName]/observations/[timestampMs]/[source]': {
		routeId: '/radicle/repository/[rid=stringSegment]/(radicleRepository)/signed-ref/[nodeId=stringSegment]/[refName=stringSegment]/(radicleSignedRef)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'RadicleSignedRef_Timestamp.SignedRefTimestampMsSource',
				probeAtomPrefixes: ['/radicle/repository/[rid]/signed-ref/[nodeId]/[refName]/observations/[timestampMs]/[source]:RadicleSignedRef_Timestamp.SignedRefTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'nodeId', 'refName', 'rid']]]],
			},
		],
	},
	'/royalty/[targetKey]/[rightKey]/observations/[timestampMs]/[source]': {
		routeId: '/royalty/[targetKey=stringSegment]/[rightKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'RoyaltyRight_Timestamp.TargetKeyRightKeyTimestampMsSource',
				probeAtomPrefixes: ['/royalty/[targetKey]/[rightKey]/observations/[timestampMs]/[source]:RoyaltyRight_Timestamp.TargetKeyRightKeyTimestampMsSource'],
				probeCases: [[[0, '1', ['targetKey', 'rightKey', 'timestampMs', 'source']]]],
			},
		],
	},
	'/swap/quote/[source]/[quoteRequestHash]/observations/[timestampMs]': {
		routeId: '/swap/quote/[source=stringSegment]/[quoteRequestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'SwapQuote_Timestamp.SourceQuoteRequestHashTimestampMs',
				probeAtomPrefixes: ['/swap/quote/[source]/[quoteRequestHash]/observations/[timestampMs]:SwapQuote_Timestamp.SourceQuoteRequestHashTimestampMs'],
				probeCases: [[[0, '1', ['source', 'quoteRequestHash', 'timestampMs']]]],
			},
		],
	},
	'/swap/quote/[source]/[quoteRequestHash]/observations/[timestampMs]/step/[indexInQuote]': {
		routeId: '/swap/quote/[source=stringSegment]/[quoteRequestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/(swapQuoteTimestamp)/step/[indexInQuote=nonNegativeInteger]',
		mappings: [
			{
				id: 'SwapQuoteStep.QuoteIndexInQuote',
				probeAtomPrefixes: ['/swap/quote/[source]/[quoteRequestHash]/observations/[timestampMs]/step/[indexInQuote]:SwapQuoteStep.QuoteIndexInQuote'],
				probeCases: [[[0, '1', ['indexInQuote', 'source', 'quoteRequestHash', 'timestampMs']]]],
			},
		],
	},
	'/token-metadata/[metadataSubjectKey]/[metadataKey]/observations/[timestampMs]/[source]': {
		routeId: '/token-metadata/[metadataSubjectKey=stringSegment]/[metadataKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'TokenMetadataDocument.MetadataSubjectKeyMetadataKeyTimestampMsSource',
				probeAtomPrefixes: ['/token-metadata/[metadataSubjectKey]/[metadataKey]/observations/[timestampMs]/[source]:TokenMetadataDocument.MetadataSubjectKeyMetadataKeyTimestampMsSource'],
				probeCases: [[[0, '1', ['metadataSubjectKey', 'metadataKey', 'timestampMs', 'source']]]],
			},
		],
	},
	'/usage-right/[subjectKey]/[rightKey]/observations/[timestampMs]/[source]': {
		routeId: '/usage-right/[subjectKey=stringSegment]/[rightKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'UsageRight_Timestamp.SubjectKeyRightKeyTimestampMsSource',
				probeAtomPrefixes: ['/usage-right/[subjectKey]/[rightKey]/observations/[timestampMs]/[source]:UsageRight_Timestamp.SubjectKeyRightKeyTimestampMsSource'],
				probeCases: [[[0, '1', ['subjectKey', 'rightKey', 'timestampMs', 'source']]]],
			},
		],
	},
	'/wormhole/vaa/[emitterChain]/[emitter]/[sequence]': {
		routeId: '/wormhole/vaa/[emitterChain=nonNegativeInteger]/[emitter=stringSegment]/[sequence=stringSegment]',
		mappings: [
			{
				id: 'WormholeVaa.EmitterChainEmitterSequence',
				probeAtomPrefixes: ['/wormhole/vaa/[emitterChain]/[emitter]/[sequence]:WormholeVaa.EmitterChainEmitterSequence'],
				probeCases: [[[0, '1', ['emitterChain', 'emitter', 'sequence']]]],
			},
		],
	},
	'/x/user/@[username]': {
		routeId: '/x/user/@[username=stringSegment]',
		mappings: [
			{
				id: 'XUser.Username',
				probeAtomPrefixes: ['/x/user/@[username]:XUser.Username'],
				probeCases: [[[0, '1', ['username']]]],
			},
		],
	},
	'/xmtp/message/[id]': {
		routeId: '/xmtp/message/[id=stringSegment]',
		mappings: [
			{
				id: 'XmtpMessage.Id',
				probeAtomPrefixes: ['/xmtp/message/[id]:XmtpMessage.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/zerog/[slug]': {
		routeId: '/zerog/[slug=stringSegment]',
		mappings: [
			{
				id: 'ZeroGNetwork.Slug',
				probeAtomPrefixes: ['/zerog/[slug]:ZeroGNetwork.Slug'],
				probeCases: [[[0, '1', ['slug']]]],
			},
		],
	},
	'/zerog/[slug]/~/zerog/connection/[connectionId]/node-state/[nodeId]': {
		routeId: '/zerog/[slug=stringSegment]/(zeroGNetwork)/~/zerog/connection/[connectionId=stringSegment]/node-state/[nodeId=evmAddress]',
		mappings: [
			{
				id: 'BlockheadZeroGStorageNodeState.ConnectionIdNetworkNodeId',
				probeAtomPrefixes: ['/zerog/[slug]/~/zerog/connection/[connectionId]/node-state/[nodeId]:BlockheadZeroGStorageNodeState.ConnectionIdNetworkNodeId'],
				probeCases: [[[0, '1', ['connectionId', 'nodeId', 'slug']]]],
			},
		],
	},
	'/zerog/[slug]/~/zerog/connection/[connectionId]/node-state/[nodeId]/chunk/[dataRoot]/[chunkIndex]': {
		routeId: '/zerog/[slug=stringSegment]/(zeroGNetwork)/~/zerog/connection/[connectionId=stringSegment]/node-state/[nodeId=evmAddress]/(blockheadZeroGStorageNodeState)/chunk/[dataRoot=stringSegment]/[chunkIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'BlockheadZeroGStoredChunk.NodeStateDataRootChunkIndex',
				probeAtomPrefixes: ['/zerog/[slug]/~/zerog/connection/[connectionId]/node-state/[nodeId]/chunk/[dataRoot]/[chunkIndex]:BlockheadZeroGStoredChunk.NodeStateDataRootChunkIndex'],
				probeCases: [[[0, '1', ['dataRoot', 'chunkIndex', 'connectionId', 'nodeId', 'slug']]]],
			},
		],
	},
	'/zerog/[slug]/~/zerog/connection/[connectionId]/node-state/[nodeId]/observations/[timestampMs]/[source]': {
		routeId: '/zerog/[slug=stringSegment]/(zeroGNetwork)/~/zerog/connection/[connectionId=stringSegment]/node-state/[nodeId=evmAddress]/(blockheadZeroGStorageNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BlockheadZeroGStorageNodeState_Timestamp.NodeStateTimestampMsSource',
				probeAtomPrefixes: ['/zerog/[slug]/~/zerog/connection/[connectionId]/node-state/[nodeId]/observations/[timestampMs]/[source]:BlockheadZeroGStorageNodeState_Timestamp.NodeStateTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'connectionId', 'nodeId', 'slug']]]],
			},
		],
	},
	'/zerog/[slug]/~/zerog/connection/[connectionId]/node-state/[nodeId]/proof/[proofId]': {
		routeId: '/zerog/[slug=stringSegment]/(zeroGNetwork)/~/zerog/connection/[connectionId=stringSegment]/node-state/[nodeId=evmAddress]/(blockheadZeroGStorageNodeState)/proof/[proofId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadZeroGStorageProof.NodeStateProofId',
				probeAtomPrefixes: ['/zerog/[slug]/~/zerog/connection/[connectionId]/node-state/[nodeId]/proof/[proofId]:BlockheadZeroGStorageProof.NodeStateProofId'],
				probeCases: [[[0, '1', ['proofId', 'connectionId', 'nodeId', 'slug']]]],
			},
		],
	},
	'/zerog/[slug]/observations/[timestampMs]/[source]': {
		routeId: '/zerog/[slug=stringSegment]/(zeroGNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'ZeroGNetwork_Timestamp.NetworkTimestampMsSource',
				probeAtomPrefixes: ['/zerog/[slug]/observations/[timestampMs]/[source]:ZeroGNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'slug']]]],
			},
		],
	},
} as const satisfies Record<string, E2eRouteFixtureMetadata>

type E2eRouteProbeAtomForReference<
	_Prefixes extends readonly string[],
	_Reference
> = _Reference extends readonly [
	prefixIndex: infer _PrefixIndex extends number,
	caseNumber: infer _CaseNumber extends string,
	fields: infer _Fields extends readonly string[],
] ? `${_Prefixes[_PrefixIndex]}.${_CaseNumber}.${_Fields[number]}` : never

type E2eRouteProbeAtomForMapping<_Mapping> = _Mapping extends {
	probeAtomPrefixes: infer _Prefixes extends readonly string[]
	probeCases: infer _Cases extends readonly (readonly (readonly [number, string, readonly string[]])[])[]
} ? {
	[_Case in keyof _Cases]: E2eRouteProbeAtomForReference<_Prefixes, _Cases[_Case][number]>
}[number] : never

export type E2eRouteProbeAtom = E2eRouteProbeAtomForMapping<
	(typeof e2eRouteFixtureMetadataByNodeId)[keyof typeof e2eRouteFixtureMetadataByNodeId]['mappings'][number]
>
