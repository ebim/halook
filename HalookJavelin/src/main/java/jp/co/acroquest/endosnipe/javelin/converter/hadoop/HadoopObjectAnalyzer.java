/*******************************************************************************
 * ENdoSnipe 5.0 - (https://github.com/endosnipe)
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2012 Acroquest Technology Co.,Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/
package jp.co.acroquest.endosnipe.javelin.converter.hadoop;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import jp.co.acroquest.endosnipe.common.logger.SystemLogger;
import jp.co.acroquest.endosnipe.javelin.converter.hadoop.HadoopAction.ActionType;
import jp.co.acroquest.endosnipe.javelin.converter.hadoop.HadoopTaskStatus.State;
import jp.co.acroquest.endosnipe.javelin.util.ArrayList;

/**
 * Hadoop�̃I�u�W�F�N�g����͂���N���X�B
 *
 * @author y_asazuma
 *
 */
public class HadoopObjectAnalyzer
{
	/** setup�^�X�N�̃X�e�[�^�X��\��������B */
	private static final String SETUP_TASK_STATE = "setup";
	
	/** cleanup�^�X�N�̃X�e�[�^�X��\��������B */
	private static final String CLEANUP_TASK_STATE = "cleanup";
	
    /** JobStatus.getRunState()�̖߂�l */
    public enum HadoopJobStatus
    {
        /** �����G���[ */
        ERROR,          // -1
        /** ���s�� */
        RUNNING,        // 1
        /** ���� */
        SUCCEEDED,      // 2
        /** ���s */
        FAILED,         // 3
        /** ������ */
        PREP,           // 4
        /** ��~���ꂽ */
        KILLED;         // 5

        /**
         * JobStatus��Hadoop�����Ŏg���鐔�l�ɕϊ����܂��B
         * 
         * @param status �X�e�[�^�X�̗񋓑�
         * @return �P�`�T�̐��l(-1�̓G���[)
         */
        public static int getNumber(HadoopJobStatus status)
        {
            int ret = -1;
            switch (status)
            {
            case RUNNING:
                ret = 1;
                break;
            case SUCCEEDED:
                ret = 2;
                break;
            case FAILED:
                ret = 3;
                break;
            case PREP:
                ret = 4;
                break;
            case KILLED:
                ret = 5;
                break;
			default:
				ret = -1;
				break;
            }
            return ret;
        }

        /**
         * Hadoop�����Ŏg���鐔�l��JobStatus�ɕϊ����܂��B
         * 
         * @param status �P�`�T�̐��l
         * @return �X�e�[�^�X�񋓑�
         */
        public static HadoopJobStatus getStatus(int status)
        {
            HadoopJobStatus ret = HadoopJobStatus.ERROR;
            switch (status)
            {
            case 1:
                ret = HadoopJobStatus.RUNNING;
                break;
            case 2:
                ret = HadoopJobStatus.SUCCEEDED;
                break;
            case 3:
                ret = HadoopJobStatus.FAILED;
                break;
            case 4:
                ret = HadoopJobStatus.PREP;
                break;
            case 5:
                ret = HadoopJobStatus.KILLED;
                break;
            }
            return ret;
        }
    }

    /** JobID�𕪉����邽�߂̃Z�p���[�^ */
    private static String SEPARATOR = "_";

    /**
     * Hadoop��TaskTrackerStatus�I�u�W�F�N�g����z�X�g�����擾����B
     *
     * @param taskTrackerStatus Hadoop��TaskTrackerStatus
     *
     * @throws NoSuchMethodException NoSuchMethodException
     * @throws InvocationTargetException InvocationTargetException
     * @throws IllegalAccessException IllegalAccessException
     * @throws SecurityException SecurityException
     * @throws IllegalArgumentException IllegalArgumentException
     */
    public static String hostNamefromTaskTrackerStatus(Object taskTrackerStatus)
        throws IllegalArgumentException, SecurityException, IllegalAccessException,
               InvocationTargetException, NoSuchMethodException
    {
        Class<?> taskTrackerClass = taskTrackerStatus.getClass();
        // TaskTrackerStatus�ȊO�̃N���X�̏ꍇ�͏������΂�
        if (!taskTrackerClass.getName().equals("org.apache.hadoop.mapred.TaskTrackerStatus"))
        {
            return null;
        }

        // Host�������^�[��
        Method method = getAccessibleMethod(taskTrackerClass.getMethod("getHost", new Class[]{}));
		return method.invoke(taskTrackerStatus, new Object[]{}).toString();
    }

    /**
     * ���\�b�h��accesible�ɂ��ĕԂ��B
     * 
     * @param method �Ώۃ��\�b�h
     * @return accesible�ȃ��\�b�h
     */
	private static Method getAccessibleMethod(Method method) {
		method.setAccessible(true);
		return method;
	}

    /**
     * Hadoop��TaskTrackerStatus����HadoopTaskStatus�I�u�W�F�N�g�̃��X�g���쐬����B
     *
     * @param taskTrackerStatus Hadoop��TaskTrackerStatus�I�u�W�F�N�g
     *
     * @return �ϊ�����HadoopTaskStatus
     *
     * @throws NoSuchMethodException NoSuchMethodException
     * @throws InvocationTargetException InvocationTargetException
     * @throws IllegalAccessException IllegalAccessException
     * @throws SecurityException SecurityException
     * @throws IllegalArgumentException IllegalArgumentException
     */
    public static ArrayList<HadoopTaskStatus> transTaskStatus(Object taskTrackerStatus)
        throws IllegalArgumentException, SecurityException, IllegalAccessException,
               InvocationTargetException, NoSuchMethodException
    {
        Class<?> taskTrackerClass = taskTrackerStatus.getClass();
        // TaskTrackerStatus�ȊO�̃N���X�̏ꍇ�͏������΂�
        if (!taskTrackerClass.getName().equals("org.apache.hadoop.mapred.TaskTrackerStatus"))
        {
            return null;
        }

        // TaskStatus�̃��X�g�����o��
        Object taskObjectList = getAccessibleMethod(taskTrackerClass.getMethod("getTaskReports", new Class[]{})).invoke(taskTrackerStatus, new Object[]{});

        ArrayList<HadoopTaskStatus> hadoopTaskStatusList = new ArrayList<HadoopTaskStatus>();

        java.util.List<?> taskList = (java.util.ArrayList<?>)taskObjectList;

        // HadoopTaskStatus�̐ݒ�
        for (Object taskStatus : taskList)
        {
        	// Task�̃X�e�[�^�X���m�F���Asetup��������cleanup�ł������ꍇ�͖�������
            Method getStateStringMethod = taskStatus.getClass().getSuperclass().getDeclaredMethod("getStateString", new Class[]{});
            getAccessibleMethod(getStateStringMethod);
            String stateString = getStateStringMethod.invoke(taskStatus, new Object[]{}).toString();
            if (SETUP_TASK_STATE.equals(stateString) || CLEANUP_TASK_STATE.equals(stateString)) {
            	continue;
            }
            
            HadoopTaskStatus hadoopTaskStatus = new HadoopTaskStatus();

            // state
            String state = getAccessibleMethod(taskStatus.getClass().getMethod("getRunState", new Class[]{})).invoke(taskStatus, new Object[]{}).toString();

            // RUNNING�͖���
            if (state.endsWith(State.RUNNING.toString()))
                continue;

            hadoopTaskStatus.setState(state);

            // taskID
            Object taskIdObject = getAccessibleMethod(taskStatus.getClass().getMethod("getTaskID", new Class[]{})).invoke(taskStatus, new Object[]{});
            hadoopTaskStatus.setTaskID(taskIdObject.toString());
            // jobID
            hadoopTaskStatus.setJobID(getAccessibleMethod(taskIdObject.getClass().getMethod("getJobID", new Class[]{})).invoke(taskIdObject, new Object[]{}).toString());
            //Phase
            hadoopTaskStatus.setPhase(getAccessibleMethod(taskStatus.getClass().getMethod("getPhase", new Class[]{})).invoke(taskStatus, new Object[]{}).toString());
            // �J�n����
            Object startTimeObject = getAccessibleMethod(taskStatus.getClass().getMethod("getStartTime", new Class[]{})).invoke(taskStatus, new Object[]{});
            if (startTimeObject != null && startTimeObject instanceof Long)
            {
                hadoopTaskStatus.setStartTime((Long)startTimeObject);                
            }
            // �I������
            Object finishTimeObject = getAccessibleMethod(taskStatus.getClass().getMethod("getFinishTime", new Class[]{})).invoke(taskStatus, new Object[]{});
            if (finishTimeObject != null && finishTimeObject instanceof Long)
            {
                hadoopTaskStatus.setFinishTime((Long)finishTimeObject);                
            }

            hadoopTaskStatusList.add(hadoopTaskStatus);
        }

        return hadoopTaskStatusList;
    }

    /**
     * Hadoop��HeartbeatResponse�I�u�W�F�N�g����HadoopAction�I�u�W�F�N�g�̃��X�g���쐬����B
     *
     * @param heartbeatResponse TaskTrackerAction[]
     *
     * @return HadoopAction�̃��X�g
     *
     * @throws IllegalArgumentException IllegalArgumentException
     * @throws SecurityException SecurityException
     * @throws IllegalAccessException IllegalAccessException
     * @throws InvocationTargetException InvocationTargetException
     * @throws NoSuchMethodException NoSuchMethodException
     * @throws NoSuchFieldException NoSuchFieldException
     */
    public static ArrayList<HadoopAction> taskTrackerActionListFromHearbeatResponse(Object heartbeatResponse)
        throws IllegalArgumentException, SecurityException,
               IllegalAccessException, InvocationTargetException,
               NoSuchMethodException, NoSuchFieldException
    {
        Class<?> heartbeatResponseClass = heartbeatResponse.getClass();
        // HeartbeatResponse�ȊO�̃N���X�̏ꍇ�͏������΂�
        if (!heartbeatResponseClass.getName().equals("org.apache.hadoop.mapred.HeartbeatResponse"))
        {
            return null;
        }
        // TaskTrackerAction[]�����
        Method method = heartbeatResponseClass.getMethod("getActions", new Class[]{});
        getAccessibleMethod(method);
        Object[] actionList = (Object[])(method.invoke(heartbeatResponse, new Object[]{}));
        ArrayList<HadoopAction> ret = new ArrayList<HadoopAction>();

        // HadoopAction��ǉ�
        for (Object action : actionList)
        {
            HadoopAction hadoopAction = new HadoopAction();

            // �A�N�V������ʂ̔���
            // ���t���N�V�����͊��N���X�̃��\�b�h���Ăяo���Ȃ��̂ŁA���N���X���烁�\�b�h���擾����B
            Method getActionIdMethod = action.getClass().getSuperclass().getDeclaredMethod("getActionId", new Class[]{});
            getAccessibleMethod(getActionIdMethod);
            String actionType = getActionIdMethod.invoke(action, new Object[]{}).toString();
            hadoopAction.setActionType(actionType);

            // KillJob�ATaskTracker�̍č\�z�͉�͂��ȗ�
            if ( (actionType.toString().equals(ActionType.REINIT_TRACKER.toString())) ||
                 (actionType.toString().equals(ActionType.KILL_JOB.toString())) )
                continue;

            // �V�K�^�X�N���s�̏ꍇ
            if (actionType.toString().equals(ActionType.LAUNCH_TASK.toString()))
            {
                // Task�I�u�W�F�N�g�擾
                Method getTaskMethod = action.getClass().getDeclaredMethod("getTask", new Class[]{});
                getAccessibleMethod(getTaskMethod);
                Object task = getTaskMethod.invoke(action, new Object[]{});

                // Map�^�X�N���H
                Method isMapTaskMethod = task.getClass().getDeclaredMethod("isMapTask", new Class[]{});
                getAccessibleMethod(isMapTaskMethod);
                hadoopAction.setMapTask(((Boolean)(isMapTaskMethod.invoke(task, new Object[]{}))).booleanValue());

                // �W���uID
                Method getJobIDMethod = task.getClass().getSuperclass().getDeclaredMethod("getJobID", new Class[]{});
                getAccessibleMethod(getJobIDMethod);
                hadoopAction.setJobID(getJobIDMethod.invoke(task, new Object[]{}).toString());

                // �^�X�N���sID
                Method getTaskIDMethod = task.getClass().getSuperclass().getDeclaredMethod("getTaskID", new Class[]{});
                getAccessibleMethod(getTaskIDMethod);
                hadoopAction.setTaskID(getTaskIDMethod.invoke(task, new Object[]{}).toString());

                // JobConf�I�u�W�F�N�g�擾
                Method getConfMethod = task.getClass().getSuperclass().getDeclaredMethod("getConf", new Class[]{});
                getAccessibleMethod(getConfMethod);
                Object jobConf = getConfMethod.invoke(task, new Object[]{});

                // �W���u��
                hadoopAction.setJobName(jobConf.getClass().getDeclaredMethod("getJobName", new Class[]{}).invoke(jobConf, new Object[]{}).toString());

                // �����Ώۃf�[�^
                if (task.getClass().toString().equals("class org.apache.hadoop.mapred.MapTask"))
                {
					try {
						Field splitMetaInfoField = task.getClass()
								.getDeclaredField("splitMetaInfo");
						splitMetaInfoField.setAccessible(true);
						Object splitMetaInfo = splitMetaInfoField.get(task);
						String splitLocation = getAccessibleMethod(
								splitMetaInfo.getClass().getMethod(
										"getSplitLocation", new Class[] {}))
								.invoke(splitMetaInfo, new Object[] {})
								.toString();
						String startOffset = getAccessibleMethod(
								splitMetaInfo.getClass().getMethod(
										"getStartOffset", new Class[] {}))
								.invoke(splitMetaInfo, new Object[] {})
								.toString();

						hadoopAction.setInputData(splitLocation + "("
								+ startOffset + ")");
					} catch (NoSuchFieldException nsfe) {
						// TODO ���݂��Ȃ��ꍇ�̏���
						
					}
                }
            }
            // ���̑�
            else
            {
                // �^�X�N���sID
                Method getTaskIDMethod = action.getClass().getDeclaredMethod("getTaskID", new Class[]{});
                getAccessibleMethod(getTaskIDMethod);
                Object taskAttemptID = getTaskIDMethod.invoke(action, new Object[]{});
                hadoopAction.setTaskID(taskAttemptID.toString());

                // �W���uID
                Method getJobIDMethod = taskAttemptID.getClass().getDeclaredMethod("getJobID", new Class[]{});
                getAccessibleMethod(getJobIDMethod);
                Object jobID = getJobIDMethod.invoke(taskAttemptID, new Object[]{});
                hadoopAction.setJobID(jobID.toString());
            }

            ret.add(hadoopAction);
        }

        return ret;
    }

    /**
     * JobStatus�I�u�W�F�N�g����W���uID���擾����B
     *
     * @param jobStatus JobStatus�I�u�W�F�N�g
     *
     * @return �W���uID
     *
     * @throws IllegalArgumentException IllegalArgumentException
     * @throws SecurityException SecurityException
     * @throws IllegalAccessException IllegalAccessException
     * @throws InvocationTargetException InvocationTargetException
     * @throws NoSuchMethodException NoSuchMethodException
     */
    public static String getJobIDfromJobStatus(Object jobStatus)
        throws IllegalArgumentException, SecurityException, IllegalAccessException,
               InvocationTargetException, NoSuchMethodException
    {
        Class<?> jobStatusClass = jobStatus.getClass();
        // JobStatus�ȊO�̃N���X�̏ꍇ�͏������΂�
        if (!jobStatusClass.getName().equals("org.apache.hadoop.mapred.JobStatus"))
        {
            return null;
        }

        // JobID���擾
        return getAccessibleMethod(jobStatusClass.getMethod("getJobId", new Class[]{})).invoke(jobStatus, new Object[]{}).toString();
    }

    /**
     * JobStatus�I�u�W�F�N�g����͂��āA�W���u���������Ă��邩���肷��B
     *
     * @param jobStatus JobStatus�I�u�W�F�N�g
     *
     * @return �W���u�̃X�e�[�^�X
     *
     * @throws IllegalArgumentException IllegalArgumentException
     * @throws SecurityException SecurityException
     * @throws IllegalAccessException IllegalAccessException
     * @throws InvocationTargetException InvocationTargetException
     * @throws NoSuchMethodException NoSuchMethodException
     */
    public static HadoopJobStatus getJobState(Object jobStatus)
        throws IllegalArgumentException, SecurityException, IllegalAccessException,
               InvocationTargetException, NoSuchMethodException
    {
        HadoopJobStatus ret = HadoopJobStatus.ERROR;

        if (null == jobStatus)
            return ret;

        Class<?> jobStatusClass = jobStatus.getClass();
        // JobStatus�ȊO�̃N���X�̏ꍇ�͏������΂�
        if (!jobStatusClass.getName().equals("org.apache.hadoop.mapred.JobStatus"))
        {
            return ret;
        }

        // getRunState()���擾�A���s
        int state = ((Integer)(getAccessibleMethod(jobStatusClass.getMethod("getRunState", new Class[]{})).invoke(jobStatus, new Object[]{}))).intValue();

        ret = HadoopJobStatus.getStatus(state);

        return ret;
    }

    /**
     * JobID����ɃW���u�̃X�e�[�^�X���擾���܂��B
     * 
     * @param jobID �W���uID
     * @param jobTracker JobTracker�C���X�^���X
     * 
     * @return �W���u�̃X�e�[�^�X
     * 
     * @throws IllegalArgumentException IllegalArgumentException
     * @throws SecurityException SecurityException
     * @throws IllegalAccessException IllegalAccessException
     * @throws InvocationTargetException InvocationTargetException
     * @throws NoSuchMethodException NoSuchMethodException
     * @throws InstantiationException InstantiationException
     */
    public static HadoopJobStatus checkJobStatus (String jobID, Object jobTracker)
        throws IllegalArgumentException, SecurityException, IllegalAccessException,
               InvocationTargetException, NoSuchMethodException, InstantiationException,
               ClassNotFoundException
    {
        HadoopJobStatus status = HadoopJobStatus.ERROR;

        if (jobID == null || jobID.equals(""))
            return status;

        // String�^��JobID�𕪉����AJobID�I�u�W�F�N�g���쐬����
        String[] elem = jobID.split(SEPARATOR);
        // JobID��"job_xxxxxxxxxxxx_yyy�̌`�̂͂�
        if (3 != elem.length)
            return status;

        // JobID�N���X�𐶐����邽�߂̃I�u�W�F�N�g
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        Class<?> jobIDClass = loader.loadClass("org.apache.hadoop.mapred.JobID");
        // JobID�̃R���X�g���N�^������(String, int)
        Class<?>[] classes = new Class[]{String.class, int.class};
        Constructor<?> jobIDConstructor = jobIDClass.getConstructor(classes);
        // �����t���R���X�g���N�^��JobID�I�u�W�F�N�g����
        Object[] args = {elem[1], Integer.valueOf(elem[2])};
        Object[] jobIDObject = {jobIDConstructor.newInstance(args)};

        // getJobStatus���\�b�h�̈����̌^
        Class<?>[] getJobStatusTypes = new Class[]{jobIDClass};

        // getJobStatus���\�b�h�����s����JobStatus�I�u�W�F�N�g���擾
        Method getJobStatusMethod = jobTracker.getClass().getMethod("getJobStatus", getJobStatusTypes);
        Object jobStatusObject = getJobStatusMethod.invoke(jobTracker, jobIDObject);

        status = getJobState(jobStatusObject);

        return status;
    }

    /**
     * JobID�����JobInProgress���擾���AJob�̏����擾���܂��B
     * 
     * @param jobID �W���uID
     * @param jobTracker JobTracker�C���X�^���X
     * 
     * @return �W���u�̏��
     * 
     * @throws IllegalArgumentException IllegalArgumentException
     * @throws SecurityException SecurityException
     * @throws IllegalAccessException IllegalAccessException
     * @throws InvocationTargetException InvocationTargetException
     * @throws NoSuchMethodException NoSuchMethodException
     * @throws InstantiationException InstantiationException
     * @throws NoSuchFieldException 
     */
    public static HadoopJobStatusInfo getJobStatusInfo (String jobID, Object jobTracker)
        throws IllegalArgumentException, SecurityException, IllegalAccessException,
               InvocationTargetException, NoSuchMethodException, InstantiationException,
               ClassNotFoundException, NoSuchFieldException
    {
        HadoopJobStatusInfo info = new HadoopJobStatusInfo();
        info.setJobID(jobID);

        // jobID ���ݒ肳��Ă��Ȃ���΁A��� HadoopJobStatusInfo ��Ԃ�
        if (jobID == null || jobID.equals(""))
            return info;

        // String�^��JobID�𕪉����AJobID�I�u�W�F�N�g���쐬����
        String[] elem = jobID.split(SEPARATOR);
        // JobID��"job_xxxxxxxxxxxx_yyy�̌`�̂͂�
        if (3 != elem.length)
            return info;

        // JobID�N���X�𐶐����邽�߂̃I�u�W�F�N�g
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        Class<?> jobIDClass = loader.loadClass("org.apache.hadoop.mapred.JobID");
        // JobID�̃R���X�g���N�^������(String, int)
        Class<?>[] classes = new Class[]{String.class, int.class};
        Constructor<?> jobIDConstructor = jobIDClass.getConstructor(classes);
        // �����t���R���X�g���N�^��JobID�I�u�W�F�N�g����
        Object[] args = {elem[1], Integer.valueOf(elem[2])};
        Object[] jobIDObject = {jobIDConstructor.newInstance(args)};

        // getJob���\�b�h�̈����̌^
        Class<?>[] getJobTypes = new Class[]{jobIDClass};

        // getJob���\�b�h�����s����JobInProgress�I�u�W�F�N�g���擾
        Method getJobMethod = jobTracker.getClass().getMethod("getJob", getJobTypes);
        Object jobInProgressObject = getJobMethod.invoke(jobTracker, jobIDObject);
        
        //�N���������擾����
        Object startTimeObject = getAccessibleMethod(jobInProgressObject.getClass().getMethod("getStartTime", new Class[]{})).invoke(jobInProgressObject, new Object[]{});
        if (startTimeObject != null && startTimeObject instanceof Long)
        {
            info.setStartTime((Long)startTimeObject);                
        }
        //�I���������擾����
        Object finishTimeObject = getAccessibleMethod(jobInProgressObject.getClass().getMethod("getFinishTime", new Class[]{})).invoke(jobInProgressObject, new Object[]{});
        if (finishTimeObject != null && finishTimeObject instanceof Long)
        {
            info.setFinishTime((Long)finishTimeObject);                
        }
        //Submit�������擾����
        Object submitTimeObject = getAccessibleMethod(jobInProgressObject.getClass().getMethod("getCreateTimeJvn", new Class[]{})).invoke(jobInProgressObject, new Object[]{});
        if (submitTimeObject != null && submitTimeObject instanceof Long)
        {
            info.setSubmitTime((Long)submitTimeObject);                
        }

        // JobName ���擾����
        Field jobConfField = jobInProgressObject.getClass().getDeclaredField("conf");
        jobConfField.setAccessible(true);
        Object jobConfObject = jobConfField.get(jobInProgressObject);
        String jobName = getAccessibleMethod(jobConfObject.getClass().getMethod("getJobName", new Class[]{})).invoke(jobConfObject, new Object[]{}).toString();
        info.setJobName(jobName);
        
        return info;
    }

    /**
     * TaskStatus���ŐV�̏�ԂɍX�V����B
     * 
     * @param jobTracker TaskStatus���擾���邽�߂�JotTracker�B
     * @param taskStatusList TaskStatus�̃��X�g�B
     */
	public static void updateTaskStatuses(Object jobTracker, 
			ArrayList<HadoopTaskStatus> taskStatusList) {
		for (HadoopTaskStatus status : taskStatusList) {
			String taskID = status.getTaskID();
			try {
				Class<?> taskAttemptIDClass = Class.forName(
						"org.apache.hadoop.mapred.TaskAttemptID", true, Thread
								.currentThread().getContextClassLoader());
				Object taskAttemptID = getAccessibleMethod(
						taskAttemptIDClass.getMethod("forName", new Class[] { String.class}))
						.invoke(null, new Object[] { taskID });
				
				Method method = jobTracker.getClass().getDeclaredMethod(
						"getTaskStatus",
						new Class[] { taskAttemptIDClass });
				Object newStatus = getAccessibleMethod(method).invoke(jobTracker,
						new Object[] { taskAttemptID });
				
				String state = getAccessibleMethod(
						newStatus.getClass().getMethod("getRunState",
								new Class[] {})).invoke(newStatus,
						new Object[] {}).toString();
				
				status.setState(state);
				
			} catch (Exception e) {
				SystemLogger.getInstance().warn(e);
			}
		}
        
	}
}
	
