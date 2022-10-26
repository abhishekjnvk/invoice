import { useState } from "react";
import { Link } from "react-router-dom";
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  Code,
  Tooltip,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSettings,
  IconTrash,
  IconChevronDown,
  IconRefresh,
  IconDatabaseExport,
} from "@tabler/icons";
import { getAllCustomers } from "../../utils/dbModel/customer";
import { getAllInvoices } from "../../utils/dbModel/invoice";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,
    borderBottom: `1px solid ${
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background
    }`,
    marginBottom: 30,
  },
  mainSection: {
    paddingBottom: theme.spacing.sm,
  },
  user: {
    color: theme.white,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background,
        0.1
      ),
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        .background,
      0.1
    ),
  },

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    fontWeight: 500,
    height: 38,
    color: theme.white,
    backgroundColor: "transparent",
    borderColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background,
        0.1
      ),
    },

    "&[data-active]": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background,
        0.1
      ),
      borderColor: theme.fn.variant({
        variant: "filled",
        color: theme.primaryColor,
      }).background,
    },
  },
}));

export function Header({ user, tabs }) {
  const { classes, theme, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const items = tabs.map((tab) => (
    <Link to={tab.route} key={tab.label}>
      <Tabs.Tab value={tab.label}>{tab.label}</Tabs.Tab>
    </Link>
  ));

  const exportData = async () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let allCustomers = await getAllCustomers();
    allCustomers.forEach((rowArray, index) => {
      if (index === 0) {
        csvContent += Object.keys(rowArray).join(",") + "\n";
      }
      let value = Object.values(rowArray).join(",");
      csvContent += value + "\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `customers_${new Date().toLocaleDateString()}.csv`
    );
    document.body.appendChild(link); // Required for FF

    link.click();

    // export invoice data to csv
    let csvContentInvoice = "data:text/csv;charset=utf-8;";
    let allInvoices = await getAllInvoices();

    allInvoices.forEach((rowArray, index) => {
      if (index === 0) {
        csvContentInvoice += Object.keys(rowArray).join(";") + "\n";
      }
      rowArray.items = JSON.stringify(rowArray.items);
      let value = Object.values(rowArray).join(";");
      csvContentInvoice += value + "\n";
    });

    var encodedUri2 = encodeURI(csvContentInvoice);
    var link2 = document.createElement("a");
    link2.setAttribute("href", encodedUri2);
    link2.setAttribute(
      "download",
      `invoices_${new Date().toLocaleDateString()}.csv`
    );
    document.body.appendChild(link2);

    link2.click();
  };

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <div>
            <Code color="blue">Invoice Generator</Code>
            <IconRefresh
              className="mx-3 hand-pointer rotate"
              color="white"
              size={20}
              stroke={2}
              rotate={180}
            />
            <Tooltip
              label="Export Data"
              color="gray"
              position="right"
              withArrow
            >
              <Button
                size="xs"
                className="p-0"
                variant="filled"
                onClick={exportData}
              >
                <IconDatabaseExport
                  className="mx-1 hand-pointer"
                  title="Export"
                  size={16}
                />
              </Button>
            </Tooltip>
          </div>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color={theme.white}
          />

          <Menu
            width={260}
            position="bottom-end"
            transition="pop-top-right"
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  <Avatar
                    src={user.image}
                    alt={user.name}
                    radius="xl"
                    size={20}
                  />
                  <Text
                    weight={500}
                    size="sm"
                    sx={{ lineHeight: 1, color: theme.white }}
                    mr={3}
                  >
                    {user.name}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Link to="/setting">
                <Menu.Item
                  color="blue"
                  icon={<IconSettings size={14} stroke={1.5} />}
                >
                  Settings
                </Menu.Item>
              </Link>
              <Menu.Divider />
              <Menu.Label>Import/Export</Menu.Label>
              <Menu.Item
                color="blue"
                disabled
                icon={<IconRefresh size={14} stroke={1.5} />}
              >
                Sync data
              </Menu.Item>
              <Menu.Item
                color="blue"
                disabled
                icon={<IconTrash size={14} stroke={1.5} />}
              >
                Backup to GDrive (Coming Soon)
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container>
        <Tabs
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsList: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
}
