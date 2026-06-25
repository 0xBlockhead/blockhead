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
		'memberKind',
		'name',
		'canonicalSignature',
	],
	content: {
		dl: [
			[
				'memberKind',
				'name',
				'canonicalSignature',
				{
					label: 'selector or topic0',
				},
				'inputs',
				'outputs',
				'stateMutability',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Interface',
				items: [
					'interfaceId',
					'memberKey',
					'memberKind',
				],
			},
			{
				label: 'ABI shape',
				items: [
					'name',
					'canonicalSignature',
					'inputs',
					'outputs',
					'stateMutability',
				],
			},
			{
				label: 'Hash refs',
				items: [
					'selector',
					{
						label: 'topic0',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'verified ABI JSON',
					},
					{
						label: 'checked-in interface catalogs',
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
			selection: EntityProxyResource<typeof schema, EntityType.ContractInterfaceMember>
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
	entityType={EntityType.ContractInterfaceMember}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
