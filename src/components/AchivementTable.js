import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import useLocalStorage from "./StorageHook";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Course",
  },
  {
    id: "world",
    numeric: false,
    disablePadding: false,
    label: "World",
  },
  {
    id: "distance",
    numeric: true,
    disablePadding: false,
    label: "Distance",
  },
  {
    id: "elevation",
    numeric: true,
    disablePadding: false,
    label: "Elevation",
  },
  {
    id: "xp",
    numeric: true,
    disablePadding: false,
    label: "XP",
  },
];

function EnhancedPageHead(props) {
  return (
    <div>
      <Toolbar>
        <Typography variant="h6" id="tableTitle" component="div">
          Zwift Tracker
          <Typography variant="subtitle1">
            {props.courses} {props.courses === 1 ? "badge" : "badges"}
            {" unlocked "}
          </Typography>
        </Typography>
      </Toolbar>
      <LinearProgress
        variant="determinate"
        color="secondary"
        value={(props.xp / props.totalXp) * 100}
      />
      <LinearProgress
        variant="determinate"
        color="primary"
        value={(props.courses / props.totalCourses) * 100}
      />
    </div>
  );
}

EnhancedPageHead.propTypes = {
  totalCourses: PropTypes.number.isRequired,
  courses: PropTypes.number.isRequired,
  totalXp: PropTypes.number.isRequired,
  xp: PropTypes.number.isRequired,
};

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: 15,
    paddingBottom: 15,
  },
  paper: {
    maxWidth: 1060,
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 510,
  },
  tableRow: {
    cursor: "pointer",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function AchivementTable(props) {
  const { data } = props;
  const classes = useStyles();
  const [order, setOrder] = useLocalStorage("order", "desc");
  const [orderBy, setOrderBy] = useLocalStorage("orderBy", "xp");
  const [selected, setSelected] = useLocalStorage("selection", []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const totalCourses = data.length;
  const courses = selected.length;
  const totalXp = data.reduce((tXp, achmnt) => tXp + achmnt.xp, 0);
  const xp = data
    .filter((achmnt) => isSelected(achmnt.name))
    .reduce((tXp, achmnt) => tXp + achmnt.xp, 0);

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <EnhancedPageHead
          className={classes.pageHead}
          totalCourses={totalCourses}
          courses={courses}
          totalXp={totalXp}
          xp={xp}
        />

        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy)).map(
                (achivement, index) => {
                  const isItemSelected = isSelected(achivement.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      className={classes.tableRow}
                      onClick={(event) => handleClick(event, achivement.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={achivement.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {achivement.name}
                      </TableCell>
                      <TableCell>{achivement.world}</TableCell>
                      <TableCell align="right">
                        {achivement.distance}km
                      </TableCell>
                      <TableCell align="right">
                        {achivement.elevation}m
                      </TableCell>
                      <TableCell align="right">{achivement.xp}</TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Typography>
        <small>
          Developed and maintained by Sebastian Ullrich.
          <br />
          <a
            href="https://github.com/sullrich84/zwift-tracker"
            data-ribbon="Fork me on GitHub"
            title="Fork me on GitHub"
          >
            Fork Zwift Tracker on GitHub
          </a>
        </small>
      </Typography>
    </div>
  );
}
