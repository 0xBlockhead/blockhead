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
		'$registration',
		{
			label: 'content hash/artifact',
		},
		'name',
	],
	content: {
		dl: [
			[
				'$registration',
				{
					label: 'content hash algorithm/hash',
				},
				'$artifact',
				'fetchedAt',
			],
			[
				'type',
				'name',
				'active',
				'x402Support',
				'supportedTrust',
				{
					label: 'endpoint/cross-registration/document refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Service endpoints',
				items: [
					{
						label: 'Eip8004AgentServiceEndpoint list',
					},
				],
			},
			{
				label: 'Cross registrations',
				items: [
					{
						label: 'Eip8004CrossRegistration list',
					},
				],
			},
			{
				label: 'Documents',
				items: [
					{
						label: 'AiDocument list',
					},
				],
			},
			{
				label: 'Registration',
				items: [
					{
						label: 'Eip8004AgentRegistration',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'service-endpoints',
			label: 'service endpoints',
			field: '$$serviceEndpoints',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'cross-registrations',
			label: 'cross registrations',
			field: '$$crossRegistrations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'documents',
			label: 'documents',
			field: '$$documents',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Eip8004AgentRegistrationFile>
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
	entityType={EntityType.Eip8004AgentRegistrationFile}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
