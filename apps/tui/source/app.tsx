import React, { useEffect, useState } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { NavigationProvider} from './components/NavigationProvider.js';
import { Routing } from './routing.js';

type Props = {
	name: string | undefined;
};

export default function App({ name = 'Stranger' }: Props) {
  const { stdout } = useStdout();
  const [size, setSize] = useState({
    columns: stdout.columns,
    rows: stdout.rows,
  });

  useEffect(() => {
    const onResize = () => {
      setSize({ columns: stdout.columns, rows: stdout.rows });
    };
    stdout.on('resize', onResize);
    return () => { stdout.off('resize', onResize); };
  }, [stdout]);

  return (
    <NavigationProvider>
      <Box width={size.columns} height={size.rows} flexDirection="column">
        <Routing columns={size.columns} rows={size.rows} />
      </Box>
    </NavigationProvider>
  );
}
