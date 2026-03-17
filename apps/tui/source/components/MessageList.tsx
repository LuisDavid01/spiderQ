import {Box, Text, useInput, useStdout} from 'ink';
import {useState, useMemo, useEffect, useRef} from 'react';
import type {AIMessage} from '@spiderq/core/types';
import {ScrollView, type ScrollViewRef} from 'ink-scroll-view';

function estimateMessageHeight(text: string, terminalWidth: number): number {
	const lines = text.split('\n');
	return lines.reduce((acc, line) => {
		return acc + Math.max(1, Math.ceil(line.length / terminalWidth));
	}, 2); // +2 por padding top/bottom
}

function AssistantMessage({content}: {content: string}) {
	return (
		<Box flexDirection="column" paddingY={1}>
			<Box gap={1}>
				<Text color="green" bold>
					●
				</Text>
				<Text color="green" dimColor>
					assistant
				</Text>
			</Box>
			<Box marginLeft={2}>
				<Text wrap="wrap">{content}</Text>
			</Box>
		</Box>
	);
}

function UserMessage({content}: {content: string}) {
	return (
		<Box flexDirection="column" paddingY={1}>
			<Box gap={1}>
				<Text color="cyan" bold>
					▸
				</Text>
				<Text color="cyan" dimColor>
					user
				</Text>
			</Box>
			<Box marginLeft={2}>
				<Text color="white" wrap="wrap">
					{content}
				</Text>
			</Box>
		</Box>
	);
}

function ToolMessage({
	content,
	tool_call_id,
}: {
	content: string;
	tool_call_id: string;
}) {
	return (
		<Box flexDirection="column" paddingY={1}>
			<Box gap={1}>
				<Text color="yellow">⚙</Text>
				<Text color="yellow" dimColor>
					tool
				</Text>
				<Text dimColor>· {tool_call_id}</Text>
			</Box>
			<Box marginLeft={2}>
				<Text dimColor wrap="wrap">
					{content.slice(0, 100)}...
				</Text>
			</Box>
		</Box>
	);
}

function MessageItem({message}: {message: AIMessage}) {
	switch (message.role) {
		case 'assistant':
			return <AssistantMessage content={message.content as string} />;
		case 'user':
			return <UserMessage content={message.content} />;
		case 'tool':
			return (
				<ToolMessage
					content={message.content}
					tool_call_id={message.tool_call_id}
				/>
			);
	}
}

interface MessageListProps {
	messages: AIMessage[];
	rows: number;
}

export function MessageList({messages, rows}: MessageListProps) {
	const {stdout} = useStdout();
	const scrollRef = useRef<ScrollViewRef>(null);
	const [contentHeight, setContentHeight] = useState(0);
	const [viewportHeight, setViewportHeight] = useState(0);
	const HEADER_HEIGHT = 1;
	const FOOTER_HEIGHT = 1;
	const scrollMaxHeight = rows - HEADER_HEIGHT - FOOTER_HEIGHT;
	const lastMessage = messages[messages.length - 1];

	const maxScrollOffset = Math.max(0, contentHeight - viewportHeight);

	useEffect(() => {
		const handleResize = () => scrollRef.current?.remeasure();
		stdout?.on('resize', handleResize);
		return () => {
			stdout?.off('resize', handleResize);
		};
	}, [stdout]);

	useEffect(() => {
		if (messages.length > 0) {
			setTimeout(() => {
				scrollRef.current?.scrollToBottom();
			}, 0);
		}
	}, [messages]);

	const handleScroll = (offset: number) => {
		const currentOffset = scrollRef.current?.getScrollOffset() ?? 0;
		const newOffset = Math.max(0, Math.min(offset, maxScrollOffset));
		if (newOffset !== currentOffset) {
			scrollRef.current?.scrollTo(newOffset);
		}
	};

	useInput((_, key) => {
		const currentOffset = scrollRef.current?.getScrollOffset() ?? 0;
		if (key.upArrow) handleScroll(currentOffset - 1);
		if (key.downArrow) handleScroll(currentOffset + 1);
		if (key.pageUp) {
			const height = viewportHeight || 1;
			handleScroll(currentOffset - height);
		}
		if (key.pageDown) {
			const height = viewportHeight || 1;
			handleScroll(currentOffset + height);
		}
	});

	return (
		<Box flexDirection="column">
			{/* Header */}
			<Box
				paddingX={1}
				borderStyle="single"
				borderTop={false}
				borderLeft={false}
				borderRight={false}
				borderBottom={true}
			>
				<Text bold>messages</Text>
				<Box flexGrow={1} />
				<Text dimColor>{messages.length} total</Text>
			</Box>

			{/* Scroll area */}
			<Box flexDirection="column" height={scrollMaxHeight} overflow="hidden">
				<ScrollView
					ref={scrollRef}
					onContentHeightChange={setContentHeight}
					onViewportSizeChange={({height}) => setViewportHeight(height)}
				>
					<Box flexDirection="column" paddingX={1}>
						{messages.length === 0 ? (
							<Box paddingY={1}>
								<Text dimColor>No hay mensajes aún.</Text>
							</Box>
						) : (
							messages.map((message, index) => (
								<MessageItem key={index} message={message} />
							))
						)}
					</Box>
				</ScrollView>
			</Box>

			{/* Footer */}
			<Box
				paddingX={1}
				borderStyle="single"
				borderTop={true}
				borderBottom={false}
				borderLeft={false}
				borderRight={false}
				gap={2}
			>
				<Text dimColor>↑↓ scroll</Text>
				<Text dimColor>pgup/pgdn jump</Text>
			</Box>
		</Box>
	);
}
