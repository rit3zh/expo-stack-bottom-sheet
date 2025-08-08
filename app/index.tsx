import { BottomSheet, BottomSheetProviderWithViewport } from "@/components";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import {
  Appearance,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

Appearance.setColorScheme("dark");

export default function Index() {
  const TaskDetailsContent = () => (
    <View style={taskStyles.container}>
      <View style={taskStyles.header}>
        <View style={taskStyles.badge}>
          <Text style={taskStyles.badgeText}>HIGH PRIORITY</Text>
        </View>
        <Text style={taskStyles.time}>2h left</Text>
      </View>

      <Text style={taskStyles.title}>Complete Presentation</Text>
      <Text style={taskStyles.description}>
        Finalize Q4 slides and prepare notes for tomorrow's meeting with
        stakeholders.
      </Text>

      <View style={taskStyles.section}>
        <Text style={taskStyles.sectionTitle}>Tasks</Text>
        {[
          { text: "Review data", done: true },
          { text: "Update metrics", done: true },
          { text: "Add achievements", done: false },
          { text: "Prepare Q&A", done: false },
        ].map((task, index) => (
          <TouchableOpacity key={index} style={taskStyles.taskItem}>
            <View
              style={[taskStyles.checkbox, task.done && taskStyles.checked]}
            >
              {task.done && <View style={taskStyles.checkmark} />}
            </View>
            <Text
              style={[taskStyles.taskText, task.done && taskStyles.taskDone]}
            >
              {task.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const CalendarContent = () => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const dates = Array.from({ length: 35 }, (_, i) => i - 2);

    return (
      <View style={calendarStyles.container}>
        <View style={calendarStyles.nav}>
          <TouchableOpacity>
            <Feather name="chevron-left" size={20} color="#666" />
          </TouchableOpacity>
          <Text style={calendarStyles.month}>December 2024</Text>
          <TouchableOpacity>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={calendarStyles.weekDays}>
          {days.map((day, index) => (
            <Text key={index} style={calendarStyles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={calendarStyles.dates}>
          {dates.map((date, index) => {
            const actualDate =
              date <= 0 ? 30 + date : date > 31 ? date - 31 : date;
            const isOutside = date <= 0 || date > 31;
            const isToday = actualDate === 15;
            const hasEvent = [8, 15, 22].includes(actualDate);

            return (
              <TouchableOpacity
                key={index}
                style={[calendarStyles.date, isToday && calendarStyles.today]}
              >
                <Text
                  style={[
                    calendarStyles.dateText,
                    isOutside && calendarStyles.outsideText,
                    isToday && calendarStyles.todayText,
                  ]}
                >
                  {actualDate}
                </Text>
                {hasEvent && !isOutside && <View style={calendarStyles.dot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={calendarStyles.events}>
          <Text style={calendarStyles.eventsTitle}>Today</Text>
          {[
            { time: "10:00", title: "Team Sync" },
            { time: "14:00", title: "Review" },
            { time: "16:30", title: "Planning" },
          ].map((event, index) => (
            <View key={index} style={calendarStyles.event}>
              <Text style={calendarStyles.eventTime}>{event.time}</Text>
              <Text style={calendarStyles.eventTitle}>{event.title}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const ProjectsContent = () => (
    <View style={projectStyles.container}>
      <View style={projectStyles.stats}>
        <View style={projectStyles.stat}>
          <Text style={projectStyles.statValue}>12</Text>
          <Text style={projectStyles.statLabel}>Active</Text>
        </View>
        <View style={projectStyles.stat}>
          <Text style={projectStyles.statValue}>89%</Text>
          <Text style={projectStyles.statLabel}>Complete</Text>
        </View>
        <View style={projectStyles.stat}>
          <Text style={projectStyles.statValue}>3</Text>
          <Text style={projectStyles.statLabel}>Review</Text>
        </View>
      </View>

      <Text style={projectStyles.title}>Projects</Text>
      {[
        { name: "Mobile Redesign", progress: 75 },
        { name: "API Integration", progress: 45 },
        { name: "Performance", progress: 90 },
      ].map((project, index) => (
        <View key={index} style={projectStyles.project}>
          <View style={projectStyles.projectInfo}>
            <Text style={projectStyles.projectName}>{project.name}</Text>
            <Text style={projectStyles.projectProgress}>
              {project.progress}%
            </Text>
          </View>
          <View style={projectStyles.progressBar}>
            <View
              style={[
                projectStyles.progressFill,
                { width: `${project.progress}%` },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );

  const SuccessContent = () => (
    <View style={successStyles.container}>
      <View style={successStyles.icon}>
        <Feather name="check" size={32} color="#FFF" />
      </View>
      <Text style={successStyles.title}>Completed</Text>
      <Text style={successStyles.message}>Task marked as done</Text>
    </View>
  );

  const NestedSheetContent = () => (
    <View style={nestedStyles.container}>
      <Text style={nestedStyles.title}>Settings</Text>
      <View style={nestedStyles.options}>
        {["Notifications", "Privacy", "Account", "Help"].map((option) => (
          <TouchableOpacity
            key={option}
            style={nestedStyles.option}
            onPress={() => {
              BottomSheet.show(
                <>
                  <Text style={{ color: "#FFF", fontSize: 16 }}>
                    {option} Settings
                  </Text>
                  <Text style={{ color: "#666", fontSize: 14, marginTop: 8 }}>
                    Configure your {option.toLowerCase()} preferences here.
                  </Text>
                </>,
                {
                  title: option,
                  dismissOnBackdrop: true,
                }
              );
            }}
          >
            <Text style={nestedStyles.optionText}>{option}</Text>
            <Feather name="chevron-right" size={18} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const showTaskSheet = () => {
    BottomSheet.show(<TaskDetailsContent />, {
      title: "Task",
      size: "large",
      actions: [
        {
          label: "Complete",
          variant: "primary",
          onPress: () => {
            BottomSheet.show(<SuccessContent />, {
              size: "small",
              duration: 2000,
            });
          },
          dismissOnPress: false,
        },
        {
          label: "Options",
          onPress: () => {
            BottomSheet.show(<NestedSheetContent />, {
              title: "Options",
              size: "medium",
            });
          },
          dismissOnPress: false,
        },
      ],
    });
  };

  const showCalendarSheet = () => {
    BottomSheet.show(<CalendarContent />, {
      title: "Calendar",
      size: "large",
      actions: [
        {
          label: "Today",
          variant: "primary",
          onPress: () => {},
          dismissOnPress: false,
        },
      ],
    });
  };

  const showProjectsSheet = () => {
    BottomSheet.show(<ProjectsContent />, {
      title: "Projects",
      size: "medium",
      actions: [
        {
          label: "View All",
          dismissOnPress: false,
          onPress: () => {
            BottomSheet.show(
              <View style={{ padding: 20 }}>
                <Text style={{ color: "#FFF", fontSize: 16 }}>
                  All projects will be shown here
                </Text>
              </View>,
              {
                title: "All Projects",
                size: "large",
              }
            );
          },
        },
        {
          label: "Show Tasks",
          dismissOnPress: false,
          onPress: () => {
            BottomSheet.show(<TaskDetailsContent />, {
              title: "Task",
              size: "large",
              actions: [
                {
                  label: "Complete",
                  variant: "primary",

                  onPress: () => {
                    BottomSheet.show(<SuccessContent />, {
                      size: "small",
                    });
                  },
                  dismissOnPress: false,
                },
                {
                  label: "Options",
                  dismissOnPress: false,
                  onPress: () => {
                    BottomSheet.show(<NestedSheetContent />, {
                      title: "Options",
                      size: "medium",
                    });
                  },
                },
              ],
            });
          },
        },
      ],
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <BottomSheetProviderWithViewport>
            <View style={styles.content}>
              <View style={styles.header}>
                <View>
                  <Text style={styles.label}>Friday, Dec 15</Text>
                  <Text style={styles.title}>Dashboard</Text>
                </View>
                <TouchableOpacity style={styles.menu}>
                  <Feather name="menu" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.statsGrid}>
                <TouchableOpacity
                  style={styles.statCard}
                  onPress={showTaskSheet}
                >
                  <Text style={styles.statNumber}>24</Text>
                  <Text style={styles.statLabel}>Tasks</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statCard}
                  onPress={showProjectsSheet}
                >
                  <Text style={styles.statNumber}>5</Text>
                  <Text style={styles.statLabel}>Projects</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statCard}
                  onPress={showCalendarSheet}
                >
                  <Text style={styles.statNumber}>3</Text>
                  <Text style={styles.statLabel}>Meetings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statCard}>
                  <Text style={styles.statNumber}>89%</Text>
                  <Text style={styles.statLabel}>Done</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionCard}
                    onPress={showTaskSheet}
                  >
                    <Feather name="plus" size={20} color="#FFF" />
                    <Text style={styles.actionText}>New Task</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionCard}
                    onPress={showCalendarSheet}
                  >
                    <Feather name="calendar" size={20} color="#FFF" />
                    <Text style={styles.actionText}>Schedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionCard}
                    onPress={showProjectsSheet}
                  >
                    <Feather name="folder" size={20} color="#FFF" />
                    <Text style={styles.actionText}>Projects</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionCard}>
                    <Feather name="bar-chart-2" size={20} color="#FFF" />
                    <Text style={styles.actionText}>Reports</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {[
                    { title: "Design Review", time: "10:00" },
                    { title: "Team Standup", time: "11:30" },
                    { title: "Documentation", time: "14:00" },
                  ].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.listItem}
                      onPress={showTaskSheet}
                    >
                      <View>
                        <Text style={styles.listTitle}>{item.title}</Text>
                        <Text style={styles.listTime}>{item.time}</Text>
                      </View>
                      <Feather name="chevron-right" size={18} color="#333" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </BottomSheetProviderWithViewport>
        </SafeAreaView>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  label: {
    color: "#666",
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "700",
  },
  menu: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },
  statCard: {
    width: (SCREEN_WIDTH - 32 - 8) / 2,
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  statNumber: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionCard: {
    width: (SCREEN_WIDTH - 40 - 10) / 2,
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#222",
  },
  actionText: {
    color: "#999",
    fontSize: 12,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  listTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  listTime: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#111",
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  navItem: {
    padding: 8,
  },
  navCenter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});

const taskStyles = StyleSheet.create({
  container: {
    padding: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#222",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
  },
  time: {
    color: "#666",
    fontSize: 12,
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    color: "#999",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#FFF",
    borderColor: "#FFF",
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: "#000",
    borderRadius: 2,
  },
  taskText: {
    color: "#CCC",
    fontSize: 14,
  },
  taskDone: {
    color: "#666",
    textDecorationLine: "line-through",
  },
});

const calendarStyles = StyleSheet.create({
  container: {
    padding: 4,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  month: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  weekDay: {
    color: "#666",
    fontSize: 11,
    fontWeight: "600",
    width: 40,
    textAlign: "center",
  },
  dates: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  date: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  today: {
    backgroundColor: "#FFF",
    borderRadius: 8,
  },
  dateText: {
    color: "#999",
    fontSize: 14,
  },
  outsideText: {
    color: "#333",
  },
  todayText: {
    color: "#000",
    fontWeight: "600",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#666",
    position: "absolute",
    bottom: 8,
  },
  events: {
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 16,
  },
  eventsTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  event: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  eventTime: {
    color: "#666",
    fontSize: 12,
    width: 45,
  },
  eventTitle: {
    color: "#CCC",
    fontSize: 14,
    flex: 1,
  },
});

const projectStyles = StyleSheet.create({
  container: {
    padding: 4,
  },
  stats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  statValue: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    color: "#666",
    fontSize: 10,
    marginTop: 4,
  },
  title: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  project: {
    marginBottom: 16,
  },
  projectInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  projectName: {
    color: "#FFF",
    fontSize: 14,
  },
  projectProgress: {
    color: "#666",
    fontSize: 12,
  },
  progressBar: {
    height: 2,
    backgroundColor: "#222",
    borderRadius: 1,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFF",
  },
});

const successStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  message: {
    color: "#666",
    fontSize: 14,
  },
});

const nestedStyles = StyleSheet.create({
  container: {
    padding: 4,
  },
  title: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },
  options: {
    gap: 4,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  optionText: {
    color: "#CCC",
    fontSize: 14,
  },
});
