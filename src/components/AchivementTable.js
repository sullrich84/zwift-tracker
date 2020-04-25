import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Hidden from "@material-ui/core/Hidden";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
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

function EnhancedPageHead(props) {
  return (
    <div>
      <Toolbar>
        <Typography variant="h6" id="tableTitle" component="div">
          Zwift Tracker
        </Typography>
        <div className={props.classes.pageHead}>
          <Chip
            size="small"
            color="primary"
            variant="outlined"
            avatar={<Avatar>C</Avatar>}
            label={`${props.courses} of ${props.totalCourses}`}
          />
          <Chip
            size="small"
            color="secondary"
            variant="outlined"
            avatar={<Avatar>XP</Avatar>}
            label={`${props.xp} of ${props.totalXp}`}
          />
        </div>
      </Toolbar>
      <LinearProgress
        variant="determinate"
        color="primary"
        value={(props.courses / props.totalCourses) * 100}
      />
      <LinearProgress
        variant="determinate"
        color="secondary"
        value={(props.xp / props.totalXp) * 100}
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

function EnhancedTableHeadCell(props) {
  const {
    id,
    classes,
    numeric,
    disablePadding,
    order,
    orderBy,
    onRequestSort,
    label,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableCell
      key={id}
      align={numeric ? "right" : "left"}
      padding={disablePadding ? "none" : "default"}
      sortDirection={orderBy === id ? order : false}
    >
      <TableSortLabel
        active={orderBy === id}
        direction={orderBy === id ? order : "asc"}
        onClick={createSortHandler(id)}
      >
        {label}
        {orderBy === id ? (
          <span className={classes.visuallyHidden}>
            {order === "desc" ? "sorted descending" : "sorted ascending"}
          </span>
        ) : null}
      </TableSortLabel>
    </TableCell>
  );
}

EnhancedTableHeadCell.propTypes = {
  id: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  numeric: PropTypes.bool.isRequired,
  disablePadding: PropTypes.bool.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  label: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: 15,
    paddingBottom: 15,
  },
  pageHead: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
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
  wrapIcon: {
    verticalAlign: "middle",
    display: "inline-flex",
    marginRight: theme.spacing(1),
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
          classes={classes}
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
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <EnhancedTableHeadCell
                  id="name"
                  classes={classes}
                  numeric={false}
                  disablePadding={true}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  label="Course"
                />
                <Hidden mdDown>
                  <EnhancedTableHeadCell
                    id="world"
                    classes={classes}
                    numeric={false}
                    disablePadding={false}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    label="World"
                  />
                </Hidden>
                <EnhancedTableHeadCell
                  id="distance"
                  classes={classes}
                  numeric={true}
                  disablePadding={false}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  label="Distance"
                />
                <Hidden mdDown>
                  <EnhancedTableHeadCell
                    id="elevation"
                    classes={classes}
                    numeric={true}
                    disablePadding={false}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    label="Elevation"
                  />
                </Hidden>
                <EnhancedTableHeadCell
                  id="xp"
                  classes={classes}
                  numeric={true}
                  disablePadding={false}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  label="XP"
                />
              </TableRow>
            </TableHead>

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
                        <br />
                        <Hidden lgUp>
                          <small>{achivement.world}</small>
                        </Hidden>
                      </TableCell>
                      <Hidden mdDown>
                        <TableCell>{achivement.world}</TableCell>
                      </Hidden>
                      <TableCell align="right">
                        {achivement.distance}km
                        <br />
                        <Hidden lgUp>
                          <small>{achivement.elevation}m</small>
                        </Hidden>
                      </TableCell>
                      <Hidden mdDown>
                        <TableCell align="right">
                          {achivement.elevation}m
                        </TableCell>
                      </Hidden>
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
