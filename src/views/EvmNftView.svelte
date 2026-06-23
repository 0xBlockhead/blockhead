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
			'$contract',
			'tokenId',
			'name',
		],
		content: {
			dl: [
				[
					'$contract',
					'tokenId',
					'standard',
					'format',
					'tokenUri',
					'name',
					'description',
					'image',
					'fetchedAt',
				],
				[
					'agentRegistry',
					'agentId',
					'agentUri',
					'contactEndpoint',
					'$agentWallet',
					'x402Support',
					'active',
					'supportedTrust',
					'registrationTypeIri',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Registry',
					items: [
						'$contract',
					],
				},
				{
					label: 'Agent',
					items: [
						'agentRegistry',
						'agentId',
						'agentUri',
						'contactEndpoint',
						'$agentWallet',
					],
				},
				{
					label: 'Registration metadata',
					items: [
						'standard',
						'format',
						'tokenUri',
						'name',
						'description',
						'image',
						'fetchedAt',
						'x402Support',
						'active',
						'supportedTrust',
						'registrationTypeIri',
					],
				},
				{
					label: 'Registrations list',
					items: [
						{
							slot: 'Eip8004Registrations',
							label: 'Agent-registration NFTs',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNft>
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
	entityType={EntityType.EvmNft}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
