<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		'$network',
		'$room',
		{
			label: 'requester/responder peers',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'$room',
				{
					label: 'requester/responder peers',
				},
				'$signer',
				'domain',
			],
			[
				'uri',
				'chainId',
				'nonce',
				{
					label: 'issued/expires/not-before times',
				},
				'requestOrigin',
			],
			[
				{
					label: 'signature presence',
				},
				'verificationMethod',
				{
					label: 'verified time',
				},
				'verified',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Message',
				items: [
					{
						label: 'full ERC-4361 message',
					},
					{
						label: 'parsed scheme/domain/address/statement/resources',
					},
				],
			},
			{
				label: 'Verification',
				items: [
					{
						label: 'EOA ERC-191 recovery or contract ERC-1271 result',
					},
					'signatureKind',
					{
						label: 'error',
					},
					{
						label: 'local verifier timestamp',
					},
				],
			},
			{
				label: 'Signer',
				items: [
					{
						label: 'signer EVM account plus ENS reverse/profile evidence when resolved',
					},
				],
			},
			{
				label: 'Room',
				items: [
					{
						label: 'parent local room',
					},
					{
						label: 'peer ids',
					},
				],
			},
			{
				label: 'Session scope',
				items: [
					'uri',
					'requestId',
					'resources',
					{
						label: 'expiration',
					},
					{
						label: 'replay checks',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSiweChallenge>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.BlockheadSiweChallenge}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
